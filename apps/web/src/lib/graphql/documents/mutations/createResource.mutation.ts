import { gql } from "../../__generated__";

export const CREATE_RESOURCE = gql(`
	mutation CreateResource($data: ResourceCreateInput!) {
		resource: createResource(data: $data) {
			...ResourceFragment
		}
	}
`);
