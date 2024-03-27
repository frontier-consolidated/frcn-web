import { gql } from "../../__generated__";

export const EDIT_CONTENT_CONTAINER_FILE = gql(`
	mutation EditContentContainerFile($id: ID!, $data: ContentContainerFileEditInput!) {
		file: editContentContainerFile(id: $id, data: $data) {
			id
		}
	}
`);
