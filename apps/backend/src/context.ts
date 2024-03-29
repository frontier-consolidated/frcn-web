import type { Server } from "http";

import type { ApolloServer } from "@apollo/server";
import type { S3Client } from "@aws-sdk/client-s3";
import type { Client as DiscordClient, REST as DiscordREST } from "discord.js";
import type { Express } from "express";

import type { GQLContext } from "./graphql/context";

export type Context = {
	server: Server;
	expressApp: Express;
	apolloServer: ApolloServer<GQLContext>;
	discordClient: DiscordClient;
	discordRest: DiscordREST;
	s3Client: S3Client;
	s3Bucket: string;
};

export type RouteConfig = {
	auth: {
		clientId: string;
		clientSecret: string;
	},
	consent: {
		cookie: string;
	},
	files: {
		bucketName: string;
	}
}