import { gql } from "../../__generated__";

export const CURRENT_USER_ROLES_UPDATED = gql(`
	subscription OnCurrentUserRolesUpdated($userId: ID!) {
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
