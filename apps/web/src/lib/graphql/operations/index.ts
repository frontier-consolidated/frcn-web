import { CURRENT_USER } from "./currentUser.query";
import { CURRENT_RSVPS } from "./currentRsvps.query";
import { GET_EVENT } from "./getEvent.query";
import { GET_EVENT_SETTINGS } from "./getEventSettings.query";

import { CREATE_EVENT } from "./createEvent.mutation";
import { EDIT_EVENT } from "./editEvent.mutation";
import { POST_EVENT } from "./postEvent.mutation";

export const Queries = {
	CURRENT_USER,
	CURRENT_RSVPS,
	GET_EVENT,
	GET_EVENT_SETTINGS,
};

export const Mutations = {
	CREATE_EVENT,
	EDIT_EVENT,
	POST_EVENT,
};
