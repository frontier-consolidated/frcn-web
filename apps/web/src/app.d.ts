
import type { TypedApolloClient } from "$lib/graphql";
import type { GetAllRolesQuery, GetCurrentUserQuery } from "$lib/graphql/__generated__/graphql";

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
		// interface PageState {}
		// interface Platform {}
	}

	namespace NodeJS {
		interface ProcessEnv {
			TZ?: string;
			NODE_ENV?: string;

			CMS_BUS_DATABASE_URL: string;
			CMS_BUS_SCHEMA: string;
		}
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
