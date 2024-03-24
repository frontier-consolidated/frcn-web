import { gql } from "../../__generated__";

export const DELETE_CONTENT_CONTAINER_FILE = gql(`
	mutation DeleteContentContainerFile($id: ID!) {
		deleted: deleteContentContainerFile(id: $id)
	}
`);
