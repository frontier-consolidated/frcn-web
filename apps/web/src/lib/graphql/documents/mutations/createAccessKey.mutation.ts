import { gql } from "../../__generated__";

export const CREATE_ACCESS_KEY = gql(`
	mutation CreateAccessKey {
		key: createAccessKey {
			id
			key
			description
			permissions
			updatedAt
			createdAt
		}
	}
`);
