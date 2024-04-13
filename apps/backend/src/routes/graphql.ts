import { expressMiddleware } from "@apollo/server/express4";
import type { Request } from "express";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";

import type { CreateAppOptions } from "../app";
import type { Context } from "../context";
import type { GQLContext } from "../graphql/context";
import { PluginDrainWebSocketServer } from "../graphql/plugins/drainWebSocketServer";
import schema from "../graphql/schema";
import { getRequestAccessKey } from "../middleware/accesskey.middleware";
import { getConsent } from "../middleware/session/middleware/consent.middleware";
import { getSessionID, sessionStore } from "../middleware/session/store";
import { $users } from "../services/users";

type WsContextExtra = {
	socket: WebSocket;
	request: Request
};

export default async function route(context: Context, _: unknown, appConfig: CreateAppOptions) {
	const wsServer = new WebSocketServer({
		server: context.server,
		path: "/graphql",
	});

	const store = sessionStore as unknown as Express.SessionStore;
	let storeReady = true;
	store.on("disconnect", function ondisconnect() {
		storeReady = false;
	});
	store.on("connect", function onconnect() {
		storeReady = true;
	});

	const wsCleanup = useServer<Record<string, unknown> | undefined, WsContextExtra>({
		schema,
		context: async (ctx, msg, args) => {
			if (!ctx.extra.request) throw new Error("HTTP request required to authenticate subscription");
			
			const req = ctx.extra.request;
			// @ts-expect-error ignore set-cookie implementation
			req.header = function (name) {
				return req.headers[name];
			};
			
			await (async () => {
				if (req.session) return;
				if (!storeReady) return;

				const store = sessionStore as unknown as Express.SessionStore;
				req.sessionStore = store;

				const cookieId = getSessionID(req.header("cookie") ?? "", appConfig.sessionConfig.session.cookie, appConfig.sessionConfig.session.secret);
				if (!cookieId) return;

				req.sessionID = cookieId;

				await new Promise<void>((resolve, reject) => {
					store.get(cookieId, (err, session) => {
						if (err && err.code !== "ENOENT") {
							return reject(err);
						}

						try {
							if (err || !session) {
								store.generate(req);
							} else {
								store.createSession(req, session);
							}
						} catch (e) {
							return reject(e);
						}

						resolve();
					});
				});
			})();

			await (async () => {
				const consentValue = getConsent(req, appConfig.sessionConfig.consent.cookie);
		
				if (req.session.user && consentValue !== "reject") {
					const user = await $users.getUser(req.session.user);
					if (!user) {
						delete req.session.user;
					} else {
						req.user = user;
					}
				}
			})();

			const accessKey = await getRequestAccessKey(req, appConfig.accesskeyConfig.header);
			if (accessKey) req.accessKey = accessKey;

			return {
				user: req.user,
				accesskey: req.accessKey,
				app: context,
				req: req
			} satisfies GQLContext;
		},
	}, wsServer);

	context.apolloServer.addPlugin(PluginDrainWebSocketServer(wsCleanup));
	await context.apolloServer.start();

	context.expressApp.use(
		"/graphql",
		expressMiddleware(context.apolloServer, {
			context: function ({ req }) {
				return Promise.resolve({
					user: req.user,
					accesskey: req.accessKey,
					app: context,
					req
				});
			},
		})
	);
}
