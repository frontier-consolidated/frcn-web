import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

import timeout from "connect-timeout";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import type { Context, RouteConfig } from "./context";
import { createDiscordClient } from "./discordClient";
import { createApolloServer } from "./graphql";
import { createS3Client } from "./s3Client";
import { type SessionMiddlewareConfig, sessionMiddlewares } from "./session";

interface CreateAppOptions {
  origins: string[];
  routeConfig: RouteConfig;
  sessionConfig: SessionMiddlewareConfig;
  discordConfig: {
    token: string;
  },
  s3Config: {
    bucketName: string;
    region: string;
		clientKey: string;
		clientSecret: string;
  }
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

  const apolloServer = createApolloServer(server, {
    introspection: true,
  });

  const { client: discordClient, rest: discordRest } = createDiscordClient(config.discordConfig.token);

  const s3Client = createS3Client(config.s3Config.region, config.s3Config.clientKey, config.s3Config.clientSecret)

  const context: Context = {
    expressApp: app,
    server,
    apolloServer,
    discordClient,
    discordRest,
    s3Client,
    s3Bucket: config.s3Config.bucketName
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

  return context;
}
