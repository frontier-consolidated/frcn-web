import { gql } from "../../__generated__";

export const CREATE_EVENT_CHANNEL = gql(`
	mutation CreateEventChannel($linkTo: ID!, $categoryId: ID!, $existingReadyRoomId: ID) {
		channel: createEventChannel(linkTo: $linkTo, categoryId: $categoryId, existingReadyRoomId: $existingReadyRoomId) {
			...EventChannelFragment
		}
	}
`);
