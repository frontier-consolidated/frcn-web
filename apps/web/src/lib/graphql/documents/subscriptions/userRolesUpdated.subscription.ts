import { gql } from "../../__generated__";

export const USER_ROLES_UPDATED = gql(`
	subscription OnUserRolesUpdated {
		roles: userRolesUpdated {
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
