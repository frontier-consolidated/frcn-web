import { gql } from "../../__generated__";

export const EDIT_ACCESS_KEY = gql(`
	mutation EditAccessKey($id: Int!, $data: AccessKeyEditInput!) {
		key: editAccessKey(id: $id, data: $data) {
			id
			description
			permissions
			updatedAt
			createdAt
		}
	}
`);
