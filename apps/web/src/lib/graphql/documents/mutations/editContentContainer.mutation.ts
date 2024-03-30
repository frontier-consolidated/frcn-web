import { gql } from "../../__generated__";

export const EDIT_CONTENT_CONTAINER = gql(`
	mutation EditContentContainer($id: ID!, $data: ContentContainerEditInput!) {
		container: editContentContainer(id: $id, data: $data) {
			id
		}
	}
`);
