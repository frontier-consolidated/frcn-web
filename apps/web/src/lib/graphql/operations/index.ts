import { CREATE_EVENT } from "./createEvent.mutation";
import { CREATE_ROLE } from "./createRole.mutation";
import { CURRENT_RSVPS } from "./currentRsvps.query";
import { CURRENT_USER } from "./currentUser.query";
import { DELETE_ROLE } from "./deleteRole.mutation";
import { EDIT_EVENT } from "./editEvent.mutation";
import { EDIT_ROLE } from "./editRole.mutation";
import { GET_ALL_ROLES } from "./getAllRoles.query";
import { GET_EVENT } from "./getEvent.query";
import { GET_EVENTS } from "./getEvents.query";
import { GET_EVENT_SETTINGS } from "./getEventSettings.query";
import { GET_ROLE } from "./getRole.query";
import { POST_EVENT } from "./postEvent.mutation";
import { REORDER_ROLES } from "./reorderRoles.mutation";
import { USER_ROLES_UPDATED } from "./rolesUpdated.subscription";

export const Queries = {
	CURRENT_USER,
	CURRENT_RSVPS,
	GET_EVENT,
	GET_EVENT_SETTINGS,
	GET_EVENTS,
	GET_ALL_ROLES,
	GET_ROLE
};

export const Mutations = {
	CREATE_EVENT,
	EDIT_EVENT,
	POST_EVENT,
	CREATE_ROLE,
	EDIT_ROLE,
	DELETE_ROLE,
	REORDER_ROLES
};

export const Subscriptions = {
	USER_ROLES_UPDATED
}
