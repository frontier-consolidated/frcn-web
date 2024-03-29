import { gql } from "../../__generated__";

export const DELETE_CURRENT_USER = gql(`
	mutation DeleteCurrentUser {
		deleted: deleteCurrentUser
	}
`);
