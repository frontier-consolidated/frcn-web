import { gql } from "../__generated__";

export const DELETE_RESOURCE = gql(`
	mutation DeleteResource($id: ID!) {
		deleted: deleteResource(id: $id)
	}
`);
