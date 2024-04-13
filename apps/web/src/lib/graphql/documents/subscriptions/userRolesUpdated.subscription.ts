import { gql } from "../../__generated__";

export const USER_ROLES_UPDATED = gql(`
	subscription OnUserRolesUpdated($userId: ID) {
		roles: userRolesUpdated(userId: $userId) {
			userId
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
