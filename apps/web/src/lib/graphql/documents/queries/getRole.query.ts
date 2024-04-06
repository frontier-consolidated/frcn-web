import { gql } from "../../__generated__";

export const GET_ROLE = gql(`
	query GetRole($roleId: ID!) {
		role: getRole(id: $roleId) {
			...RoleFragment
			users {
				id
				name
				avatarUrl
			}
		}
		discordRoles: getAllDiscordRoles(everyone: false) {
			id
			name
			color
		}
	}
`);
