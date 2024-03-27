import { gql } from "../../__generated__";

export const GET_CONTENT_CONTAINER_BY_ID = gql(`
	query GetContentContainerById($id: ID!) {
		container: getContentContainerById(id: $id) {
			...ContentContainerFragment
		}
	}
`);
