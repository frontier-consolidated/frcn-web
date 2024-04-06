import { gql } from "../../__generated__";

export const GET_ALL_USERS = gql(`
	query GetAllUsers($filter: UserFilterInput, $page: Int, $limit: Int) {
		users: getAllUsers(filter: $filter, page: $page, limit: $limit) {
			items {
				id
				name
				scName
				discordName
				verified
				avatarUrl
				createdAt
			}
			itemsPerPage
			page
			nextPage
			prevPage
			total
		}
	}
`);
