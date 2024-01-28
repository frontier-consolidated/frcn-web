import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

import timeout from "connect-timeout";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import type { Context } from "./context";
import { createDiscordClient } from "./discordClient";
import { createApolloServer } from "./graphql";
import { type SessionMiddlewareConfig, sessionMiddlewares } from "./session";

interface CreateAppOptions {
  origins: string[];
  sessionConfig: SessionMiddlewareConfig;
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

  const { client: discordClient, rest: discordRest } = createDiscordClient();

  const context: Context = {
    expressApp: app,
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
      default: (context: Context) => void;
    };
    module.default(context);
  }

  return context;
}
