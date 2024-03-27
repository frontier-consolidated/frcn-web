import { gql } from "../../__generated__";

export const DELETE_CONTENT_CONTAINER = gql(`
	mutation DeleteContentContainer($id: ID!) {
		deleted: deleteContentContainer(id: $id)
	}
`);
