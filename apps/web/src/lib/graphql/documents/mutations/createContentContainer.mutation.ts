import { gql } from "../../__generated__";

export const CREATE_CONTENT_CONTAINER = gql(`
	mutation CreateContentContainer($type: String!, $identifier: String, $parent: ID) {
		container: createContentContainer(type: $type, identifier: $identifier, parent: $parent) {
			...ContentContainerFragment
		}
	}
`);
