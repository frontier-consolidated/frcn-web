import { gql } from "../../__generated__";

export const END_EVENT = gql(`
	mutation EndEvent($id: ID!) {
		ended: endEvent(id: $id)
	}
`);
