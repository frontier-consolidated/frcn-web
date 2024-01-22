import { Server as HttpServer } from "http";
import { WebSocketServer } from "ws";
import { ApolloServer, ApolloServerOptionsWithSchema } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { useServer } from "graphql-ws/lib/use/ws";

import { PluginDrainWebSocketServer } from "./plugins/drainWebSocketServer";
import schema from "./schema";
import type { Context } from "./context";

type CreateApolloServerOptions = Partial<Omit<ApolloServerOptionsWithSchema<Context>, "schema">>;

export function createApolloServer(server: HttpServer, config: CreateApolloServerOptions = {}) {
	const wsServer = new WebSocketServer({
		server,
		path: "/subscriptions",
	});

	const wsCleanup = useServer({ schema }, wsServer);

	return new ApolloServer<Context>({
		schema,
		...config,
		plugins: [
			ApolloServerPluginDrainHttpServer({ httpServer: server }),
			PluginDrainWebSocketServer(wsCleanup),
		],
	});
}
