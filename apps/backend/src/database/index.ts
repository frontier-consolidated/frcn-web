import { Permission, permissions } from "@frcn/shared";
// eslint-disable-next-line import/default
import PrismaClientPkg from "@prisma/client";

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
import { isProd } from "../env";

const PrismaClient = PrismaClientPkg.PrismaClient
const Prisma = PrismaClientPkg.Prisma
export const prisma = new PrismaClient();

const $prisma = prisma;

const database = $prisma
	.$extends(createEventExtension(Prisma.defineExtension, $prisma))
	.$extends(createEventChannelExtension(Prisma.defineExtension, $prisma))
	.$extends(createEventRsvpRoleExtension(Prisma.defineExtension, $prisma))
	.$extends(createEventSettingsExtension(Prisma.defineExtension, $prisma))
	.$extends(createEventsWithUserRoleForAccessExtension(Prisma.defineExtension, $prisma))
	.$extends(createEventUserExtension(Prisma.defineExtension, $prisma))
	.$extends(createSystemSettingsExtension(Prisma.defineExtension, $prisma))
	.$extends(createUserExtension(Prisma.defineExtension, $prisma))
	.$extends(createUserRoleExtension(Prisma.defineExtension, $prisma))
	.$extends(createUserSessionExtension(Prisma.defineExtension, $prisma))
	.$extends(createUserSettingsExtension(Prisma.defineExtension, $prisma))
	.$extends(createUsersInUserRolesExtension(Prisma.defineExtension, $prisma))
	.$extends(createUserStatusExtension(Prisma.defineExtension, $prisma));

export { database }