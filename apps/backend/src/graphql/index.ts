import { Server as HttpServer } from "http";

import { ApolloServer, type ApolloServerOptionsWithSchema } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { createApollo4QueryValidationPlugin } from "graphql-constraint-directive/apollo4";
import { useServer } from "graphql-ws/lib/use/ws";
import isUrl from "validator/lib/isURL";
import { WebSocketServer } from "ws";

import type { GQLContext } from "./context";
import { PluginDrainWebSocketServer } from "./plugins/drainWebSocketServer";
import schema from "./schema";

type CreateApolloServerOptions = Partial<Omit<ApolloServerOptionsWithSchema<GQLContext>, "schema">>;

export function createApolloServer(server: HttpServer, config: CreateApolloServerOptions = {}) {
	const wsServer = new WebSocketServer({
		server,
		path: "/subscriptions",
	});

	const wsCleanup = useServer({ schema }, wsServer);

	return new ApolloServer<GQLContext>({
		schema,
		...config,
		plugins: [
			ApolloServerPluginDrainHttpServer({ httpServer: server }),
			PluginDrainWebSocketServer(wsCleanup),
			createApollo4QueryValidationPlugin({
				formats: {
					url: (value) => {
						if (typeof value !== "string") return false;
						return isUrl(value, {
							require_protocol: true,
							require_valid_protocol: true,
							protocols: ["https"],
							validate_length: true,
						});
					},
				},
			}),
		],
	});
}
