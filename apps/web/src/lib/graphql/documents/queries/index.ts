import { CURRENT_RSVPS } from "./currentRsvps.query";
import { CURRENT_USER } from "./currentUser.query";
import { GET_ALL_ROLES } from "./getAllRoles.query";
import { GET_EVENT } from "./getEvent.query";
import { GET_EVENTS } from "./getEvents.query";
import { GET_EVENT_SETTINGS } from "./getEventSettings.query";
import { GET_OWNED_EVENTS } from "./getOwnedEvents.query";
import { GET_RESOURCES } from "./getResources.query";
import { GET_ROLE } from "./getRole.query";
import { GET_SYSTEM_SETTINGS } from "./getSystemSettings.query";
import { GET_USER } from "./getUser.query";

export const Queries = {
	CURRENT_USER,
	CURRENT_RSVPS,
	GET_EVENT,
	GET_EVENT_SETTINGS,
	GET_EVENTS,
	GET_ALL_ROLES,
	GET_ROLE,
	GET_RESOURCES,
	GET_OWNED_EVENTS,
	GET_USER,
	GET_SYSTEM_SETTINGS
};
