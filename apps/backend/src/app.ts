import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

import { Permission, hasPermission } from "@frcn/shared";
import timeout from "connect-timeout";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type NextFunction, type Request, type RequestHandler, type Response } from "express";
import statusMonitor from "express-status-monitor";

import { createCmsEventBus } from "./cmsEvents";
import type { Context, RouteConfig } from "./context";
import { createDiscordClient } from "./discordClient";
import { getBasePath, isProd } from "./env";
import { createApolloServer } from "./graphql";
import { accesskeyMiddleware, type AccessKeyMiddlewareConfig } from "./middleware/accesskey.middleware";
import { type SessionMiddlewareConfig, sessionMiddlewares } from "./middleware/session";
import { createS3Client } from "./s3Client";
import { $users } from "./services/users";

interface CreateAppOptions {
    origins: string[];
    routeConfig: RouteConfig;
    sessionConfig: SessionMiddlewareConfig;
    accesskeyConfig: AccessKeyMiddlewareConfig;
    discordConfig: {
        token: string;
    },
    s3Config: {
        bucketName: string;
        region: string;
        clientKey: string;
        clientSecret: string;
    },
    cmsConfig: {
        databaseUrl: string;
        schema: string;
    }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createApp(config: CreateAppOptions) {
    const app = express();
    const server = http.createServer(app);

    app.set("trust proxy", true);

    const monitor = statusMonitor({
        socketPath: getBasePath() + "/socket.io"
    }) as RequestHandler & { middleware: RequestHandler, pageRoute: RequestHandler }
    app.use(monitor.middleware)

    app.get("/health", (_req, res) => {
        res.setHeader("Cache-Control", "private, no-cache, no-store, max-ages=0");
        res.sendStatus(200);
    });

    app.use(
        cors({
            origin: config.origins,
            credentials: true,
        }),
    );

    app.use(
        timeout("15s", {
            respond: true,
        }),
    );

    app.use(cookieParser());

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(sessionMiddlewares(config.sessionConfig));
    app.use(accesskeyMiddleware(config.accesskeyConfig))

    app.get("/metrics", async (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({
                message: "Must be authenticated"
            })
        }

        if (!hasPermission(await $users.getPermissions(req.user), Permission.Admin)) {
            return res.status(403).send({
                message: "Missing permissions"
            })
        }

        next()
    }, monitor.pageRoute)

    const apolloServer = createApolloServer(server, {
        introspection: true,
    });

    const { client: discordClient, rest: discordRest } = createDiscordClient(config.discordConfig.token);

    const s3Client = createS3Client(config.s3Config.region, config.s3Config.clientKey, config.s3Config.clientSecret)

    const cmsBus = await createCmsEventBus(config.cmsConfig.databaseUrl, config.cmsConfig.schema)

    const context: Context = {
        expressApp: app,
        server,
        apolloServer,
        discordClient,
        discordRest,
        s3Client,
        s3Bucket: config.s3Config.bucketName,
        cmsBus
    };

    const files = fs.readdirSync(path.join(__dirname, "routes"), {
        encoding: "utf-8",
        withFileTypes: true,
    });

    for (const file of files) {
        if (!file.isFile()) continue;

        const module = (await import(path.join(file.path, file.name))) as {
            default: (context: Context, config: RouteConfig) => void;
        };
        module.default(context, config.routeConfig);
    }

    let webOnStart: (() => Promise<void>) | null = null;
    const webHandler = path.join(__dirname, "../../web/build/handler.js")
    if (fs.existsSync(webHandler) && process.env.SERVE_WEB === "true" && isProd()) {
        const { handler, on_start } = await import(webHandler) as {
            handler: RequestHandler;
            on_start: () => Promise<void>;
        }

        app.use(handler)
        webOnStart = on_start
    }

    app.use((err: Error | Error[], req: Request, res: Response, _next: NextFunction) => {
        const errors = Array.isArray(err) ? err : [err];
        for (const error of errors) {
            console.error(error);
        }
    
        // if (res.headersSent) return;
    
        res.status(500).send({
            message: "An error occured on the server!",
            errors,
        });
    });

    return {
        context,
        async onStart() {
            if (webOnStart) {
                await webOnStart()
            }
        }
    };
}
