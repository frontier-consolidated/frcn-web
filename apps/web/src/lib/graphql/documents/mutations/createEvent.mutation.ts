import { gql } from "../../__generated__";

export const CREATE_EVENT = gql(`
	mutation CreateEvent($startAt: Timestamp) {
		event: createEvent(startAt: $startAt)
	}
`);
