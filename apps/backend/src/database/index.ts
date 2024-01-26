import { PrismaClient } from "@prisma/client";

import { createEventExtension } from "./extensions/Event.extension";
import { createEventChannelExtension } from "./extensions/EventChannel.extension";
import { createEventRsvpRoleExtension } from "./extensions/EventRsvpRole.extension";
import { createEventSettingsExtension } from "./extensions/EventSettings.extension";
import { createEventsWithUserRoleForAccessExtension } from "./extensions/EventsWithUserRoleForAccess.extension";
import { createEventUserExtension } from "./extensions/EventUser.extension";
import { createSystemSettingsExtension } from "./extensions/SystemSettings.extension";
import { createUserExtension } from "./extensions/User.extension";
import { createUserRoleExtension } from "./extensions/UserRole.extension";
import { createUserSessionExtension } from "./extensions/UserSession.extension";
import { createUserSettingsExtension } from "./extensions/UserSettings.extension";
import { createUsersInUserRolesExtension } from "./extensions/UsersInUserRoles.extension";
import { createUserStatusExtension } from "./extensions/UserStatus.extension";

export const prisma = new PrismaClient();

const $prisma = prisma;

export const database = $prisma
	.$extends(createEventExtension($prisma))
	.$extends(createEventChannelExtension($prisma))
	.$extends(createEventRsvpRoleExtension($prisma))
	.$extends(createEventSettingsExtension($prisma))
	.$extends(createEventsWithUserRoleForAccessExtension($prisma))
	.$extends(createEventUserExtension($prisma))
	.$extends(createSystemSettingsExtension($prisma))
	.$extends(createUserExtension($prisma))
	.$extends(createUserRoleExtension($prisma))
	.$extends(createUserSessionExtension($prisma))
	.$extends(createUserSettingsExtension($prisma))
	.$extends(createUsersInUserRolesExtension($prisma))
	.$extends(createUserStatusExtension($prisma));
