import { gql } from "../__generated__";

export const EDIT_EVENT = gql(`
	mutation EditEvent($editEventId: ID!, $data: EventEditInput!) {
		event: editEvent(id: $editEventId, data: $data) {
			...EventFragment
			...EventSettingsFragment
		}
	}
`);
