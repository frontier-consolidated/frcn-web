import { gql } from "../../__generated__";

export const ROLES_UPDATED = gql(`
	subscription OnRolesUpdated {
		roles: rolesUpdated {
			...RoleFragment
			users {
				id
			}
		}
	}
`);
