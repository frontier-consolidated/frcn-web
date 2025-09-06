import type { ApolloServerPlugin } from "@apollo/server";

import { logger } from "../../logger";
import type { GQLContext } from "../context";

export function PluginLogging(): ApolloServerPlugin<GQLContext> {
	return {
		// eslint-disable-next-line require-await
		async requestDidStart() {
			const startAt = Date.now();
			return {
				// eslint-disable-next-line require-await
				async willSendResponse(requestContext) {
					if (!requestContext.request.query?.includes("__schema")) {
						logger.log("GraphQL request:", {
							httpId: requestContext.contextValue.req.id,
							elapsed: `${Date.now() - startAt}ms`,
							query: requestContext.request.query?.replace(/\s+/g, " ")
						});
					}
				}
			};
		}
	};
}
