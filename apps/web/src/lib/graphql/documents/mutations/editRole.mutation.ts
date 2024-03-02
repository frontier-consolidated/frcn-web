import { gql } from "../../__generated__";

export const EDIT_ROLE = gql(`
	mutation EditRole($roleId: ID!, $data: RoleEditInput!) {
		role: editRole(id: $roleId, data: $data) {
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
