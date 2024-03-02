import { gql } from "../../__generated__";

export const GET_EVENT = gql(`
	query GetEvent($eventId: ID!) {
		event: getEvent(id: $eventId) {
			...EventFragment
		}
	}
`);
