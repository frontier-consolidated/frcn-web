import { gql } from "../../__generated__";

export const POST_EVENT = gql(`
	mutation PostEvent($eventId: ID!) {
		success: postEvent(id: $eventId)
	}
`);
