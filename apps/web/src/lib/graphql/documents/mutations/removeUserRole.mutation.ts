import { gql } from "../../__generated__";

export const REMOVE_USER_ROLE = gql(`
	mutation RemoveUserRole($userId: ID!, $roleId: ID!) {
		removed: removeUserRole(userId: $userId, roleId: $roleId)
	}
`);
