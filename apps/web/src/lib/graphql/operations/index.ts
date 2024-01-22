import { CURRENT_USER } from "./currentUser.query";
import { CURRENT_RSVPS } from "./currentRsvps.query";

import { CREATE_EVENT } from "./createEvent.mutation";
import { GET_EVENT } from "./getEvent.query";
import { GET_EVENT_SETTINGS } from "./getEventSettings.query";

export const Queries = {
	CURRENT_USER,
	CURRENT_RSVPS,
	GET_EVENT,
	GET_EVENT_SETTINGS,
};

export const Mutations = {
	CREATE_EVENT,
};
