import { gql } from "../../__generated__";

export const CURRENT_USER_SERVER = gql(`
	query GetCurrentUserOnServer {
		user: getCurrentUser {
			id
			permissions
		}
	}
`);
