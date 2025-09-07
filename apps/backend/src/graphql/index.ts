import { Server as HttpServer } from "http";

import { ApolloServer, type ApolloServerOptionsWithSchema } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { createApollo4QueryValidationPlugin } from "graphql-constraint-directive/apollo4";
import isUrl from "validator/lib/isURL";

import type { GQLContext } from "./context";
import { PluginLogging } from "./plugins/logging";
import schema from "./schema";
import { logger } from "../logger";

type CreateApolloServerOptions = Partial<Omit<ApolloServerOptionsWithSchema<GQLContext>, "schema">>;

export function createApolloServer(server: HttpServer, config: CreateApolloServerOptions = {}) {
	return new ApolloServer<GQLContext>({
		schema,
		logger,
		formatError(formattedError, error) {
			logger.error(error);
			return formattedError;
		},
		...config,
		plugins: [
			PluginLogging(),
			ApolloServerPluginDrainHttpServer({ httpServer: server }),
			createApollo4QueryValidationPlugin({
				formats: {
					url: (value) => {
						if (typeof value !== "string") return false;
						return isUrl(value, {
							require_protocol: true,
							require_valid_protocol: true,
							protocols: ["https"],
							validate_length: true
						});
					}
				}
			})
		]
	});
}
