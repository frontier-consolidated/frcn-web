import { gql } from "../__generated__";

export const DELETE_ROLE = gql(`
	mutation DeleteRole($roleId: ID!) {
		deleted: deleteRole(id: $roleId)
	}
`);
