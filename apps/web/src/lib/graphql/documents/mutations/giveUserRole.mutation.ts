import { gql } from "../../__generated__";

export const GIVE_USER_ROLE = gql(`
	mutation GiveUserRole($userId: ID!, $roleId: ID!) {
		role: giveUserRole(userId: $userId, roleId: $roleId) {
			id
			name
			discordId
			primary
			permissions
			updatedAt
			createdAt
		}
	}
`);
