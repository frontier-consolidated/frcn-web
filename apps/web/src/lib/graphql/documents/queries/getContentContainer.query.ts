import { gql } from "../../__generated__";

export const GET_CONTENT_CONTAINER = gql(`
	query GetContentContainer($identifier: String!, $type: String!) {
		container: getContentContainer(identifier: $identifier, type: $type) {
			...ContentContainerFragment
		}
	}
`);
