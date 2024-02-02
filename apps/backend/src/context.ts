import type { Server } from "http";

import type { ApolloServer } from "@apollo/server";
import type { Client as DiscordClient, REST as DiscordREST } from "discord.js";
import type { Express } from "express";

import type { GQLContext } from "./graphql/context";

export type Context = {
	server: Server;
	expressApp: Express;
	apolloServer: ApolloServer<GQLContext>;
	discordClient: DiscordClient;
	discordRest: DiscordREST;
};

export type RouteConfig = {
	consentCookie: string;
}