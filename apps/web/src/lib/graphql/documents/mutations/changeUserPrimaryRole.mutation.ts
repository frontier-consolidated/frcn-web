import { gql } from "../../__generated__";

export const CHANGE_USER_PRIMARY_ROLE = gql(`
	mutation ChangeUserPrimaryRole($userId: ID!, $roleId: ID!) {
		role: changeUserPrimaryRole(userId: $userId, roleId: $roleId) {
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
