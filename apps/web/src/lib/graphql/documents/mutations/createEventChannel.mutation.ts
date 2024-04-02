import { gql } from "../../__generated__";

export const CREATE_EVENT_CHANNEL = gql(`
	mutation CreateEventChannel($linkTo: ID!) {
		channel: createEventChannel(linkTo: $linkTo) {
			...EventChannelFragment
		}
	}
`);
