import { gql } from "../../__generated__";

export const EDIT_EVENT = gql(`
	mutation EditEvent($eventId: ID!, $data: EventEditInput!) {
		event: editEvent(id: $eventId, data: $data) {
			...EventFragment
			...EventSettingsFragment
		}
	}
`);
