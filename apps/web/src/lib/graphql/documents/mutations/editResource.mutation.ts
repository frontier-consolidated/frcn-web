import { gql } from "../../__generated__";

export const EDIT_RESOURCE = gql(`
	mutation EditResource($id: ID!, $data: ResourceEditInput!) {
		resource: editResource(id: $id, data: $data) {
			...ResourceFragment
		}
	}
`);
