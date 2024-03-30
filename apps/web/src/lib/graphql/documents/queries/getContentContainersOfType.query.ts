import { gql } from "../../__generated__";

export const GET_CONTENT_CONTAINERS_OF_TYPE = gql(`
	query GetContentContainersOfType($type: String!) {
		containers: getContentContainersOfType(type: $type) {
			...ContentContainerFragment
		}
	}
`);
