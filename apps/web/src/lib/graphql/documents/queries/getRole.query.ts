import { gql } from "../../__generated__";

export const GET_ROLE = gql(`
	query GetRole($roleId: ID!) {
		role: getRole(id: $roleId) {
			id
			name
			discordId
			primary
			permissions
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
