import { gql } from "../__generated__";

export const GET_ALL_ROLES = gql(`
	query GetAllRoles {
		roles: getRoles {
			...RoleFragment
			users {
				id
			}
		}
	}
`);
