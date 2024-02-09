import { gql } from "../__generated__";

export const CURRENT_USER = gql(`
	query GetCurrentUser {
		user: getCurrentUser {
			...UserFragment
			permissions
			settings {
				updatedAt
			}
			status {
				activity
				ship
				updatedAt
			}
		}
	}
`);
