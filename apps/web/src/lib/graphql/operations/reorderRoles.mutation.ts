import { gql } from "../__generated__";

export const REORDER_ROLES = gql(`
	mutation ReorderRoles($order: [ID!]!) {
		order: reorderRoles(order: $order)
	}
`);
