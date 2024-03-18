import { gql } from "../../__generated__";

export const GET_USER = gql(`
	query GetUser($id: ID!) {
		user: getUser(id: $id) {
			...UserFragment
		}
	}
`);
