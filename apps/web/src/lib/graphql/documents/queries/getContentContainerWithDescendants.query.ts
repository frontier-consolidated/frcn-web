import { gql } from "../../__generated__";

export const GET_CONTENT_CONTAINER_WITH_DESCENDANTS = gql(`
	query GetContentContainerWithDescendants($identifier: String!, $type: String!) {
		container: getContentContainer(identifier: $identifier, type: $type) {
			...ContentContainerFragment
			recursiveChildren
		}
	}
`);
