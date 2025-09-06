import type { Server } from "http";

import type { ApolloServer } from "@apollo/server";
import type { S3Client } from "@aws-sdk/client-s3";
import type { REST as DiscordREST } from "discord.js";
import type { Express } from "express";

import type { DiscordClient } from "./bot";
import type { GQLContext } from "./graphql/context";

export type Context = {
	server: Server;
	expressApp: Express;
	apolloServer: ApolloServer<GQLContext>;
	discordClient: DiscordClient;
	discordRest: DiscordREST;
	s3Client: S3Client;
	s3Bucket: string;
	// cmsBus: Bus;
};

export type RouteConfig = {
	auth: {
		clientId: string;
		clientSecret: string;
	};
	consent: {
		cookie: string;
	};
	files: {
		bucketName: string;
	};
};
