import { gql } from "../../__generated__";

export const RSVP_FOR_EVENT = gql(`
	mutation RsvpForEvent($eventId: ID!, $rsvpId: ID!) {
		success: rsvpForEvent(id: $eventId, rsvp: $rsvpId)
	}
`);
