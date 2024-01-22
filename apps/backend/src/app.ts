import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import express from "express";
import cors from "cors";
import timeout from "connect-timeout";
import cookieParser from "cookie-parser";
import { SessionMiddlewareConfig, sessionMiddleware } from "./auth/session";
import { createApolloServer } from "./graphql";
import { authMiddleware } from "./auth/auth";
import { RouteContext } from "./routeContext";
import { createDiscordClient } from "./discordClient";

interface CreateAppOptions {
	origins: string[];
	cookieSecret: string;
	session: SessionMiddlewareConfig;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createApp(config: CreateAppOptions) {
	const app = express();
	const server = http.createServer(app);

	app.set("trust proxy", true);

	app.get("/health", (_req, res) => {
		res.setHeader("Cache-Control", "private, no-cache, no-store, max-age=0");
		res.sendStatus(200);
	});

	app.use(
		cors({
			origin: config.origins,
			credentials: true,
		})
	);

	app.use(
		timeout("15s", {
			respond: true,
		})
	);

	app.use(cookieParser(config.cookieSecret));

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use(sessionMiddleware(config.session));
	app.use(authMiddleware());

	const apolloServer = createApolloServer(server, {
		introspection: true,
	});

	const { client: discordClient, rest: discordRest } = createDiscordClient();

	const context: RouteContext = {
		app,
		server,
		apolloServer,
		discordClient,
		discordRest,
	};

	const files = fs.readdirSync(path.join(__dirname, "routes"), {
		encoding: "utf-8",
		withFileTypes: true,
	});

	for (const file of files) {
		if (!file.isFile()) continue;

		const module = (await import(path.join(file.path, file.name))) as {
			default: (context: RouteContext) => void;
		};
		module.default(context);
	}

	return context;
}
