import { gql } from "../../__generated__";

export const REGENERATE_ACCESS_KEY = gql(`
	mutation RegenerateAccessKey($id: Int!) {
		key: regenerateAccessKey(id: $id) {
			id
			key
		}
	}
`);
