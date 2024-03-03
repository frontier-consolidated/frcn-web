import { gql } from "../../__generated__";

export const DELETE_EVENT = gql(`
	mutation DeleteEvent($id: ID!) {
		deleted: deleteEvent(id: $id)
	}
`);
