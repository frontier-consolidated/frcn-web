import { gql } from "../../__generated__";

export const UNRSVP_FOR_EVENT = gql(`
	mutation UnrsvpForEvent($eventId: ID!) {
		success: unrsvpForEvent(id: $eventId)
	}
`);
