import { expressMiddleware } from "@apollo/server/express4";

import type { Context } from "../context";

export default async function route(context: Context) {
	await context.apolloServer.start();

	context.expressApp.use(
		"/graphql",
		expressMiddleware(context.apolloServer, {
			context: function ({ req }) {
				return Promise.resolve({
					user: req.user,
					app: context,
					req
				});
			},
		})
	);
}
