import { gql } from "../../__generated__";

export const DELETE_ACCESS_KEY = gql(`
	mutation DeleteAccessKey($id: Int!) {
		deleted: deleteAccessKey(id: $id)
	}
`);
