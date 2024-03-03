import { gql } from "../../__generated__";

export const GET_OWNED_EVENTS = gql(`
	query GetOwnedEvents {
		events: getCurrentUser {
			events {
				...EventFragment
			}
		}
	}
`);
