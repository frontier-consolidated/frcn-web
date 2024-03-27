import { gql } from "../../__generated__";

export const GET_ALL_ACCESS_KEYS = gql(`
	query GetAllAccessKeys {
		keys: getAllAccessKeys {
			id
			description
			permissions
			updatedAt
			createdAt
		}
	}
`);
