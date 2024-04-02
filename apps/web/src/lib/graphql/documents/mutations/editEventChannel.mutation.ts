import { gql } from "../../__generated__";

export const EDIT_EVENT_CHANNEL = gql(`
	mutation EditEventChannel($id: Int!, $data: EventChannelEditInput!) {
		channel: editEventChannel(id: $id, data: $data) {
			...EventChannelFragment
		}
	}
`);
