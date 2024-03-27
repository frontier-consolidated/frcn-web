
import type { TypedApolloClient } from "$lib/graphql";
import type { CreateAccessKeyMutation, GetAllRolesQuery, GetCurrentUserQuery } from "$lib/graphql/__generated__/graphql";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			apollo: TypedApolloClient;
			user?: GetCurrentUserQuery["user"] & {
				cookie: string
			}
		}
		interface PageData {
			roles: GetAllRolesQuery["roles"]
		}
		interface PageState {
			newAccessKey?: CreateAccessKeyMutation["key"]
		}
		// interface Platform {}
	}
	
	declare module "*&imagetools" {
		/**
		 * actual types
		 * - code https://github.com/JonasKruckenberg/imagetools/blob/main/packages/core/src/output-formats.ts
		 * - docs https://github.com/JonasKruckenberg/imagetools/blob/main/docs/guide/getting-started.md#metadata
		 */
		const out;
		export default out;
	}
}

export {};
