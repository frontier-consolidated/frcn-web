import type { User } from "@prisma/client";

import type { AppSession } from "$server/sessions/session.server";
import type { transformers } from "$server/transformers";

declare global {
	namespace App {
		interface Session {
			pkce?: {
				challenge_method: string;
				challenge: string;
				verifier: string;
			} | null;
		}

		interface Locals {
			session: AppSession;
			user?: User | null;
		}

		// interface Error {}
		interface PageData {
			authenticated: boolean;
			current_user: Awaited<ReturnType<typeof transformers.user.private>> | null;
		}
		// interface PageState {}
		// interface Platform {}
	}

	declare module "*&imagetools" {
		const out;
		export default out;
	}
}

export {};
