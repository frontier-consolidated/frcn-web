import { gql } from "../../__generated__";

export const GET_ALL_USERS = gql(`
	query GetAllUsers {
		users: getAllUsers {
			id
			name
			scName
			discordName
			verified
			avatarUrl
			createdAt
		}
	}
`);
