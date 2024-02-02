
import type { TypedApolloClient } from "$lib/graphql";
import type { GetCurrentUserQuery } from "$lib/graphql/__generated__/graphql";

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
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
