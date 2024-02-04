import { gql } from "../__generated__";

export const GET_ALL_ROLES = gql(`
	query GetAllRoles {
		roles: getRoles {
			id
			name
			primary
			discordId
			permissions
			users {
				id
			}
		}
	}
`);
