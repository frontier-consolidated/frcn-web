import { EventRsvpRole, EventSettings, EventUser, Prisma } from "@prisma/client";
import {
	Event as GQLEvent,
	EventRsvp as GQLEventRsvp,
	PartialEvent,
	PartialEventRsvpRole,
	EventRsvpRole as GQLEventRsvpRole,
	EventMember as GQLEventMember,
	EventSettings as GQLEventSettings,
	Resolvers,
	EventAccessType,
} from "../../__generated__/resolvers-types";
import { database } from "../../../database";
import { resolvePartialUser } from "./User";
import { EventMember, EventWithInclude, events } from "../../../services/events";
import { Context } from "../../context";
import { resolveDiscordChannel } from "./System";

export async function resolvePartialEvent(event: EventWithInclude, context: Context) {
	const owner = await database.user.findUnique({
		where: { id: event.ownerId },
	});

	const channel = await database.eventChannel.findUnique({
		where: { id: event.channelId },
	});

	let locationVisible = true;
	if (event.settings.hideLocation) {
		locationVisible = context.user?.id == owner?.id || event.startAt <= new Date().getTime();
	}

	return {
		id: event.id,
		channel: await resolveDiscordChannel(channel, context),
		owner: owner ? resolvePartialUser(owner) : null,
		name: event.name,
		summary: event.summary,
		description: event.description,
		imageUrl: event.imageUrl,
		eventType: event.eventType,
		location: locationVisible ? event.location : null,
		startAt: event.startAt,
		endedAt: event.endedAt,
		duration: event.duration,
		updatedAt: event.updatedAt.getTime(),
		createdAt: event.createdAt.getTime(),
	} satisfies PartialEvent;
}

export async function resolveEvent(event: EventWithInclude, context: Context) {
	const roles = event.roles.map(resolveEventRsvpRole);
	return {
		...(await resolvePartialEvent(event, context)),
		roles,
		members: event.members.map((member) => resolveEventMember(member, roles)),
		settings: resolveEventSettings(event.settings),
		accessType: event.accessType as EventAccessType,
		accessRoles: [], // field-resolved
		posted: event.posted,
	} satisfies GQLEvent;
}

function resolveEventSettings(settings: EventSettings) {
	return {
		hideLocation: settings.hideLocation,
		inviteOnly: settings.inviteOnly,
		openToJoinRequests: settings.openToJoinRequests,
		allowTeamSwitching: settings.allowTeamSwitching,
		allowCrewSwitching: settings.allowCrewSwitching,
	} satisfies GQLEventSettings;
}

function resolveEventMember(member: EventMember, roles: GQLEventRsvpRole[]) {
	return {
		id: member.id,
		pending: member.pending,
		user: resolvePartialUser(member.user),
		rsvp: roles.find((role) => role.members.includes(member.id))!.id,
		rsvpAt: member.createdAt.getTime(),
	} satisfies GQLEventMember;
}

function resolvePartialEventRsvpRole(role: EventRsvpRole) {
	return {
		id: role.id,
		name: role.name,
	} satisfies PartialEventRsvpRole;
}

function resolveEventRsvpRole(
	role: EventRsvpRole | Prisma.EventRsvpRoleGetPayload<{ include: { members: true } }>
) {
	return {
		id: role.id,
		name: role.name,
		limit: role.limit,
		members: "members" in role ? role.members.map((member) => member.id) : [],
	} satisfies GQLEventRsvpRole;
}

export async function resolveEventRsvp(rsvp: EventUser, context: Context) {
	const rsvpRole = await database.eventRsvpRole.findUnique({
		where: { id: rsvp.rsvpId },
	});
	const event = await events.getEvent(rsvp.eventId);

	return {
		invite: rsvp.pending,
		event: await resolvePartialEvent(event, context),
		rsvp: resolvePartialEventRsvpRole(rsvpRole),
		rsvpAt: rsvp.createdAt.getTime(),
	} satisfies GQLEventRsvp;
}

export const eventResolvers: Resolvers = {
	Query: {
		async getEvent(source, args, context): Promise<GQLEvent & { _event: EventWithInclude }> {
			const event = await events.getEvent(args.id);
			if (!event) return null;

			if (!events.canSeeEvent(event, context.user, context.appContext.discordClient))
				return null;
			return {
				_event: event,
				...(await resolveEvent(event, context)),
			};
		},
	},

	Mutation: {
		async createEvent(source, args, context) {
			if (!context.user) return null;

			const event = await events.createEvent(context.user);
			return event.id;
		},
	},
};
