import { gql } from "../../__generated__";

export const GET_CONTENT_CONTAINER_CHILDREN = gql(`
	query GetContentContainerChildren($id: ID!) {
		container: getContentContainerById(id: $id) {
			children {
				...ContentContainerFragment
			}
		}
	}
`);
