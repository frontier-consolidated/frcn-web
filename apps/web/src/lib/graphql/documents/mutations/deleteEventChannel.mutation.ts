import { gql } from "../../__generated__";

export const DELETE_EVENT_CHANNEL = gql(`
	mutation DeleteEventChannel($id: Int!) {
		deleted: deleteEventChannel(id: $id)
	}
`);
