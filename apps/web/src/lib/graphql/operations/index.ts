import { CREATE_EVENT } from "./createEvent.mutation";
import { CURRENT_RSVPS } from "./currentRsvps.query";
import { CURRENT_USER } from "./currentUser.query";
import { EDIT_EVENT } from "./editEvent.mutation";
import { GET_EVENT } from "./getEvent.query";
import { GET_EVENT_SETTINGS } from "./getEventSettings.query";
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
