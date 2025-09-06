import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

import timeout from "connect-timeout";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";

import type { Context, RouteConfig } from "./context";
import { createDiscordClient } from "./discordClient";
import { createApolloServer } from "./graphql";
import { logger } from "./logger";
import {
	accesskeyMiddleware,
	type AccessKeyMiddlewareConfig
} from "./middleware/accesskey.middleware";
import { addressMiddleware } from "./middleware/address.middleware";
import { idMiddleware } from "./middleware/id.middleware";
import { rateLimitMiddleware } from "./middleware/rateLimit.middleware";
import { type SessionMiddlewareConfig, sessionMiddlewares } from "./middleware/session";
import { timestampMiddleware } from "./middleware/timestamp.middleware";
import { createS3Client } from "./s3Client";

export interface CreateAppOptions {
	origins: string[];
	routeConfig: RouteConfig;
	sessionConfig: SessionMiddlewareConfig;
	accesskeyConfig: AccessKeyMiddlewareConfig;
	discordConfig: {
		token: string;
	};
	s3Config: {
		bucketName: string;
		region: string;
		clientKey: string;
		clientSecret: string;
	};
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createApp(config: CreateAppOptions) {
	const app = express();
	const server = http.createServer(app);

	app.set("trust proxy", true);

	app.get("/health", (_req, res) => {
		res.setHeader("Cache-Control", "private, no-cache, no-store, max-ages=0");
		res.sendStatus(200);
	});

	app.use(
		cors({
			origin: config.origins,
			credentials: true
		})
	);

	app.use(
		timeout("30s", {
			respond: true
		})
	);

	app.use(cookieParser());

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use(idMiddleware());
	app.use(timestampMiddleware());
	app.use(addressMiddleware(server));

	app.use(sessionMiddlewares(config.sessionConfig));
	app.use(accesskeyMiddleware(config.accesskeyConfig));

	app.use(rateLimitMiddleware());

	app.use((req, res, next) => {
		let ended = false;
		function end() {
			if (ended) return;
			ended = true;

			logger.log("HTTP request:", { status: res.statusCode, ...logger.requestDetails(req) });
		}

		req.once("end", end);
		req.once("error", end);
		res.once("finish", end);

		next();
	});

	const apolloServer = createApolloServer(server, {
		introspection: true
	});

	const { client: discordClient, rest: discordRest } = await createDiscordClient(
		config.discordConfig.token
	);

	const s3Client = createS3Client(
		config.s3Config.region,
		config.s3Config.clientKey,
		config.s3Config.clientSecret
	);

	// const cmsBus = await createCmsEventBus(config.cmsConfig.databaseUrl, config.cmsConfig.schema);

	const context: Context = {
		expressApp: app,
		server,
		apolloServer,
		discordClient,
		discordRest,
		s3Client,
		s3Bucket: config.s3Config.bucketName
		// cmsBus
	};

	const files = fs.readdirSync(path.join(__dirname, "routes"), {
		encoding: "utf-8",
		withFileTypes: true
	});

	for (const file of files) {
		if (!file.isFile()) continue;

		const module = (await import(path.join(file.path, file.name))) as {
			default: (context: Context, config: RouteConfig, appConfig: CreateAppOptions) => void;
		};
		module.default(context, config.routeConfig, config);
	}

	app.use((err: Error | Error[], req: Request, res: Response, _next: NextFunction) => {
		const errors = Array.isArray(err) ? err : [err];
		logger.error("HTTP Server Error", logger.requestDetails(req), ...errors);

		if (res.headersSent) return;

		res.status(500).send({
			message: "An error occured on the server!",
			errors
		});
	});

	return {
		context
	};
}
