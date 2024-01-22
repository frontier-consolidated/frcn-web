import { ApolloServerPlugin } from "@apollo/server";
import type { Disposable } from "graphql-ws";

export function PluginDrainWebSocketServer(disposable: Disposable): ApolloServerPlugin {
	return {
		async serverWillStart() {
			return {
				async drainServer() {
					await disposable.dispose();
				},
			};
		},
	};
}
