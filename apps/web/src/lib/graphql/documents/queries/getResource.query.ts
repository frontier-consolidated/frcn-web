import { gql } from "../../__generated__";

export const GET_RESOURCE = gql(`
	query GetResource($id: ID!) {
		resource: getResource(id: $id) {
			...ResourceFragment
		}
	}
`);
