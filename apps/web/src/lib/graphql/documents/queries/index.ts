import { CURRENT_RSVPS } from "./currentRsvps.query";
import { CURRENT_USER } from "./currentUser.query";
import { GET_ALL_ACCESS_KEYS } from "./getAllAccessKeys.query";
import { GET_ALL_ROLES } from "./getAllRoles.query";
import { GET_CONTENT_CONTAINER } from "./getContentContainer.query";
import { GET_CONTENT_CONTAINER_BY_ID } from "./getContentContainerById.query";
import { GET_CONTENT_CONTAINER_CHILDREN } from "./getContentContainerChildren.query";
import { GET_CONTENT_CONTAINERS_OF_TYPE } from "./getContentContainersOfType.query";
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
	GET_SYSTEM_SETTINGS,
	GET_CONTENT_CONTAINER,
	GET_CONTENT_CONTAINER_BY_ID,
	GET_CONTENT_CONTAINERS_OF_TYPE,
	GET_CONTENT_CONTAINER_CHILDREN,
	GET_ALL_ACCESS_KEYS
};
