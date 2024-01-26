import type { Server } from "http";

import type { ApolloServer } from "@apollo/server";
import type { Client as DiscordClient, REST as DiscordREST } from "discord.js";
import type { Express } from "express";

import type { Context } from "./graphql/context";

export type RouteContext = {
	app: Express;
	server: Server;
	apolloServer: ApolloServer<Context>;
	discordClient: DiscordClient;
	discordRest: DiscordREST;
};
