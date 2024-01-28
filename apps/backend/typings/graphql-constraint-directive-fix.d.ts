import type { ApolloServerPlugin } from "@apollo/server";
import type { PluginOptions } from "graphql-constraint-directive";

export {};

declare module "graphql-constraint-directive/apollo4" {
	/**
	 * Create Apollo 4 validation plugin.
	 *
	 * @param options to setup plugin. `schema` is deprecated now, not used, as plugins gets schema from the Apollo Server.
	 */
	export function createApollo4QueryValidationPlugin(options: PluginOptions): ApolloServerPlugin;
}
