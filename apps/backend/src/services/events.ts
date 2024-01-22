import { Prisma, User } from "@prisma/client";
import { database } from "../database";
import type { UserWithInclude } from "./users";
import { system } from "./system";
import { roles } from "./roles";
import { EventAccessType } from "../graphql/__generated__/resolvers-types";
import { Client as DiscordClient } from "discord.js";
import { discord } from "./discord";

const eventSettingsInclude = {
	settings: true,
} as const;
const eventInclude = {
	...eventSettingsInclude,
	roles: { include: { members: true } },
	members: { include: { user: true } },
	accessRoles: true,
	channel: true,
	owner: true,
} as const;

export type EventWithInclude = Prisma.EventGetPayload<{ include: typeof eventInclude }>;
export type EventWithSettings = Prisma.EventGetPayload<{ include: typeof eventSettingsInclude }>;
export type EventMember = Prisma.EventUserGetPayload<{ include: { user: true } }>;

async function getEvent(id: string) {
	const event = await database.event.findUnique({
		where: { id },
		include: eventInclude,
	});
	return event;
}

async function createEvent(owner: User) {
	const { defaultEventChannel } = await system.getSystemSettings();

	const event = await database.event.create({
		data: {
			owner: {
				connect: {
					id: owner.id,
				},
			},
			channel: {
				connect: {
					id: defaultEventChannel.id,
				},
			},
			name: "",
			summary: "",
			description: "",
			eventType: null,
			location: [],
			settings: {
				create: {
					hideLocation: false,
					inviteOnly: false,
					openToJoinRequests: true,
					allowTeamSwitching: false,
					allowCrewSwitching: false,
				},
			},
			accessType: EventAccessType.Channel,
			posted: false,
		},
		include: eventInclude,
	});

	return event;
}

async function canSeeEvent(
	event: EventWithInclude,
	user: UserWithInclude | undefined,
	discordClient: DiscordClient
) {
	if (event.ownerId == user?.id) return true;
	if (user && event.members.some((member) => member.userId == user.id)) return true;

	switch (event.accessType as EventAccessType) {
		case EventAccessType.PrimaryRole: {
			if (!user) return false;
			const primaryRole = await database.userRole.findUniqueOrThrow({
				where: { id: event.accessRoles[0].roleId, primary: true },
			});
			return roles.hasPrimaryRolePrivileges(primaryRole, user);
		}
		case EventAccessType.SelectRoles: {
			if (!user) return false;
			const accessRoles = await database.userRole.findMany({
				where: {
					id: {
						in: event.accessRoles.map((accessRole) => accessRole.roleId),
					},
				},
			});
			return roles.hasOneOfRoles(accessRoles, user);
		}
		case EventAccessType.Channel: {
			return await discord.canUserViewChannel(discordClient, user, event.channel.discordId);
		}
	}
	return false;
}

export const events = {
	eventInclude,
	eventSettingsInclude,
	getEvent,
	createEvent,
	canSeeEvent,
};
