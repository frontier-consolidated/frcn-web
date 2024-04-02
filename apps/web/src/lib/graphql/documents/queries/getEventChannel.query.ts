import { gql } from "../../__generated__";

export const GET_EVENT_CHANNEL = gql(`
	query GetEventChannel($id: Int!) {
		channel: getEventChannel(id: $id) {
			...EventChannelFragment
		}
	}
`);
