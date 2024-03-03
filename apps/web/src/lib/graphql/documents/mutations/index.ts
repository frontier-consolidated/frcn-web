import { CREATE_EVENT } from "./createEvent.mutation";
import { CREATE_RESOURCE } from "./createResource.mutation";
import { CREATE_ROLE } from "./createRole.mutation";
import { DELETE_EVENT } from "./deleteEvent.mutation";
import { DELETE_RESOURCE } from "./deleteResource.mutation";
import { DELETE_ROLE } from "./deleteRole.mutation";
import { EDIT_EVENT } from "./editEvent.mutation";
import { EDIT_RESOURCE } from "./editResource.mutation";
import { EDIT_ROLE } from "./editRole.mutation";
import { POST_EVENT } from "./postEvent.mutation";
import { REORDER_ROLES } from "./reorderRoles.mutation";
import { RSVP_FOR_EVENT } from "./rsvpForEvent.mutation";
import { UNRSVP_FOR_EVENT } from "./unrsvpForEvent.mutation";

export const Mutations = {
	CREATE_EVENT,
	EDIT_EVENT,
	POST_EVENT,
	DELETE_EVENT,
	RSVP_FOR_EVENT,
	UNRSVP_FOR_EVENT,
	CREATE_ROLE,
	EDIT_ROLE,
	DELETE_ROLE,
	REORDER_ROLES,
	CREATE_RESOURCE,
	EDIT_RESOURCE,
	DELETE_RESOURCE,
};
