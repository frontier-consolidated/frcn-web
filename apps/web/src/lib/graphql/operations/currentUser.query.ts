import { gql } from "../__generated__";

export const CURRENT_USER = gql(`
	query GetCurrentUser {
		user: getCurrentUser {
			id
			name
			scName
			avatarUrl
			verified
			permissions
			primaryRole {
				id
				name
			}
			roles {
				id
				name
			}
			settings {
				updatedAt
			}
			status {
				activity
				ship
				updatedAt
			}
			updatedAt
			createdAt
		}
	}
`);
