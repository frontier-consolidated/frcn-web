import { gql } from "../../__generated__";

export const USER_ROLES_UPDATED = gql(`
	subscription OnRolesUpdated($userId: ID!) {
		roles: userRolesUpdated(userId: $userId) {
			permissions
			primaryRole {
				id
				name
			}
			roles {
				id
				name
			}
		}
	}
`);
