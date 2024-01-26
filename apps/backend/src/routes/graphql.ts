import { expressMiddleware } from "@apollo/server/express4";

import { RouteContext } from "../routeContext";

export default async function route(context: RouteContext) {
	await context.apolloServer.start();

	context.app.use(
		"/graphql",
		expressMiddleware(context.apolloServer, {
			context: function ({ req }) {
				return Promise.resolve({
					user: req.user,
					appContext: context,
				});
			},
		})
	);
}
