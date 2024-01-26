import { ApolloServerPlugin } from "@apollo/server";
import type { Disposable } from "graphql-ws";

export function PluginDrainWebSocketServer(disposable: Disposable): ApolloServerPlugin {
	return {
		serverWillStart() {
			return Promise.resolve({
				async drainServer() {
					await disposable.dispose();
				},
			});
		},
	};
}
