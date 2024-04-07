import type { ApolloServerPlugin } from "@apollo/server";

import { logger } from "../../logger";

export function PluginLogging(): ApolloServerPlugin {
	return {
		// eslint-disable-next-line require-await
		async requestDidStart() {
			const startAt = Date.now();
			return {
				// eslint-disable-next-line require-await
				async willSendResponse(requestContext) {
					if (!requestContext.request.query?.includes("__schema")) {
						logger.log("GraphQL request:", {
							elapsed: `${Date.now() - startAt}ms`,
							query: requestContext.request.query?.replace(/\s+/g, " ")
						});
					}
				},
			};
		},
	};
}
