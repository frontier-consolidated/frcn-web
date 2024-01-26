import { EventType } from "@frcn/shared";
import { EventRsvpRole, EventSettings, EventUser, Event } from "@prisma/client";

import { resolveDiscordChannel, resolveDiscordEmoji, resolveDiscordRole } from "./Discord";
import { resolveUserRole } from "./Roles";
import { WithModel } from "./types";
import { resolveUser } from "./User";
import { database } from "../../../database";
import { $discord } from "../../../services/discord";
import { $events } from "../../../services/events";
import {
	Event as GQLEvent,
	EventRsvp as GQLEventRsvp,
	EventRsvpRole as GQLEventRsvpRole,
	EventMember as GQLEventMember,
	EventSettings as GQLEventSettings,
	Resolvers,
	EventAccessType,
} from "../../__generated__/resolvers-types";
import { GQLContext } from "../../context";
import { gqlErrorBadInput, gqlErrorBadState } from "../gqlError";

export function resolveEvent(event: Event) {
	return {
		_model: event,
		id: event.id,
		channel: null, // field-resolved
		owner: null, // field-resolved
		name: event.name,
		summary: event.summary,
		description: event.description,
		imageUrl: event.imageUrl,
		eventType: event.eventType,
		location: null, // field-resolved
		startAt: event.startAt,
		endedAt: event.endedAt,
		duration: event.duration,
		posted: event.posted,
		updatedAt: event.updatedAt,
		createdAt: event.createdAt,

		roles: [], // field-resolved
		members: [], // field-resolved
		mentions: [], // field-resolved
		settings: null, // field-resolved
		accessType: event.accessType as EventAccessType,
		accessRoles: [], // field-resolved
	} satisfies WithModel<GQLEvent, Event>;
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

function resolveEventMember(member: EventUser) {
	return {
		_model: member,
		id: member.id,
		pending: member.pending,
		user: null, // field-resolved
		rsvp: member.rsvpId,
		rsvpAt: member.createdAt.getTime(),
	} satisfies WithModel<GQLEventMember, EventUser>;
}

async function resolveEventRsvpRole(role: EventRsvpRole, context: GQLContext) {
	return {
		_model: role,
		id: role.id,
		name: role.name,
		emoji:
			role.emoji === role.emojiId
				? {
						id: role.emojiId,
						name: role.emoji,
				  }
				: await resolveDiscordEmoji(role.emojiId, context),
		limit: role.limit,
		members: [], // field-resolved
	} satisfies WithModel<GQLEventRsvpRole, EventRsvpRole>;
}

export function resolveEventRsvp(rsvp: EventUser) {
	return {
		_model: rsvp,
		invite: rsvp.pending,
		event: null, // field-resolved
		rsvp: null, // field-resolved
		rsvpAt: rsvp.createdAt.getTime(),
	} satisfies WithModel<GQLEventRsvp, EventUser>;
}

export const eventResolvers: Resolvers = {
	Event: {
		async channel(source: WithModel<GQLEvent, Event>, args, context) {
			const channel = await database.event.getChannel(source._model);
			return await resolveDiscordChannel(channel, context);
		},
		async owner(source: WithModel<GQLEvent, Event>) {
			const owner = await database.event.getOwner(source._model);
			return await resolveUser(owner);
		},
		async location(source: WithModel<GQLEvent, Event>, args, context) {
			const owner = await database.event.getOwner(source._model);
			const settings = await database.event.getSettings(source._model);

			if (
				settings.hideLocation &&
				context.user?.id !== owner?.id &&
				source._model.startAt > new Date()
			) {
				return null;
			}

			return source._model.location;
		},
		async roles(source: WithModel<GQLEvent, Event>, args, context) {
			const rsvpRoles = await database.event.getRoles(source._model);
			return rsvpRoles.map((role) => resolveEventRsvpRole(role, context));
		},
		async members(source: WithModel<GQLEvent, Event>) {
			const members = await database.event.getMembers(source._model);
			return members.map(resolveEventMember);
		},
		mentions(source: WithModel<GQLEvent, Event>, args, context) {
			const mentions = source._model.discordMentions;
			return mentions.map((id) => resolveDiscordRole(id, context));
		},
		async settings(source: WithModel<GQLEvent, Event>) {
			const settings = await database.event.getSettings(source._model);
			return resolveEventSettings(settings);
		},
		async accessRoles(source: WithModel<GQLEvent, Event>) {
			const accessRoles = await database.event.getAccessRoles(source._model);
			const roles = await Promise.all(
				accessRoles.map((r) => database.eventsWithUserRoleForAccess.getRole(r))
			);
			return roles.map(resolveUserRole);
		},
	},

	EventRsvpRole: {
		async members(source: WithModel<GQLEventRsvpRole, EventRsvpRole>) {
			const members = await database.eventRsvpRole.getMembers(source._model);
			return members.map((member) => member.id);
		},
	},

	EventMember: {
		async user(source: WithModel<GQLEventMember, EventUser>) {
			const user = await database.eventUser.getUser(source._model);
			return resolveUser(user);
		},
	},

	EventRsvp: {
		async event(source: WithModel<GQLEventRsvp, EventUser>) {
			const event = await database.eventUser.getEvent(source._model);
			return resolveEvent(event);
		},
		async rsvp(source: WithModel<GQLEventRsvp, EventUser>, args, context) {
			const rsvp = await database.eventUser.getRsvp(source._model);
			return resolveEventRsvpRole(rsvp, context);
		},
	},

	Query: {
		async getEvent(source, args, context): Promise<WithModel<GQLEvent, Event>> {
			const event = await $events.getEvent(args.id);
			if (!event) return null;

			if (!$events.canSeeEvent(event, context.user, context.app.discordClient))
				return null;
			return resolveEvent(event);
		},
		async getEvents(source, { filter, page, limit }, context) {
			const { search, startAt, minDuration, maxDuration, includeCompleted } = filter ?? {};

			const result = await $events.getEvents(
				{
					search,
					startAt: startAt ? new Date(startAt) : undefined,
					duration: {
						min: minDuration,
						max: maxDuration,
					},
					includeCompleted,
				},
				page,
				limit,
				context.user,
				context.app.discordClient
			);

			return {
				items: await Promise.all(result.items.map((event) => resolveEvent(event))),
				page: result.page,
				nextPage: result.nextPage,
				prevPage: result.prevPage,
				total: result.total,
			};
		},
	},

	Mutation: {
		async createEvent(source, args, context) {
			const event = await $events.createEvent(
				context.user!,
				context.app.discordClient
			);
			return event.id;
		},
		async editEvent(source, args, context) {
			if (!(await $events.eventExists(args.id))) return null;

			const data = args.data;

			if (data.channel && !(await $events.eventChannelExists(data.channel))) {
				throw gqlErrorBadInput(`Event channel not found: ${data.channel}`);
			}

			if (
				data.eventType &&
				!(Object.values(EventType) as string[]).includes(data.eventType)
			) {
				throw gqlErrorBadInput(`Event type not allowed: ${data.eventType}`);
			}

			if (data.location && data.location.length < 1) {
				throw gqlErrorBadInput(`Expected location to have atleast 1 item`);
			}

			if (data.roles) {
				if (data.roles.length < 1) {
					throw gqlErrorBadInput(`Expected atleast 1 role`);
				}
				for (const role of data.roles) {
					if (role.emoji != role.emojiId && role.emojiId.length < 17) {
						throw gqlErrorBadInput(`Invalid emoji id: ${role.emojiId}`);
					}
				}
			}

			if (data.mentions) {
				const discordRoles = await $discord.getAllRoles(context.app.discordClient);
				for (const roleId of data.mentions) {
					const role = discordRoles.find((r) => r.id === roleId);
					if (!role) {
						throw gqlErrorBadInput(`Discord role to mention not found: ${roleId}`);
					}
				}
			}

			if (data.accessType) {
				if (
					data.accessType === EventAccessType.Channel ||
					data.accessType === EventAccessType.Everyone
				) {
					data.accessRoles = [];
				} else {
					if (
						data.accessType === EventAccessType.PrimaryRole &&
						(!data.accessRoles || data.accessRoles.length != 1)
					) {
						throw gqlErrorBadInput(
							`Expected exactly 1 access role with accessType=PrimaryRole`
						);
					}
					if (
						data.accessType === EventAccessType.SelectRoles &&
						(!data.accessRoles || data.accessRoles.length < 1)
					) {
						throw gqlErrorBadInput(
							`Expected atleast 1 access role with accessType=SelectRoles`
						);
					}
					const roles = await database.userRole.findMany({
						select: { id: true, primary: true },
					});

					for (const roleId of data.accessRoles) {
						const role = roles.find((r) => r.id === roleId);
						if (!role) {
							throw gqlErrorBadInput(`Access role not found: ${roleId}`);
						}
						if (data.accessType === EventAccessType.PrimaryRole && !role.primary) {
							throw gqlErrorBadInput(
								`Found non-primary access role when accessType=PrimaryRole: ${roleId}`
							);
						}
					}
				}
			}

			const updatedEvent = await $events.editEvent(
				args.id,
				data,
				context.app.discordClient
			);
			return resolveEvent(updatedEvent);
		},
		async postEvent(source, args, context) {
			const event = await $events.getEvent(args.id);
			if (!event) return false;
			if (event.posted) return true;

			if (!event.name) throw gqlErrorBadState("Event is missing name");
			if (!event.eventType) throw gqlErrorBadState("Event is missing type");
			if (event.location.length < 1) throw gqlErrorBadState("Event is missing location");
			if (!event.startAt) throw gqlErrorBadState("Event is missing start date");
			if (!event.duration) throw gqlErrorBadState("Event is missing duration");

			if (
				event.accessType === EventAccessType.PrimaryRole ||
				event.accessType === EventAccessType.SelectRoles
			) {
				const accessRoles = await database.event.getAccessRoles(event);
				if (accessRoles.length < 1) {
					throw gqlErrorBadState("Event expected an access role");
				}
			}

			const roles = await database.event.getRoles(event);
			if (roles.length < 1) {
				throw gqlErrorBadState("Event expected atleast 1 role");
			}

			await $events.postEvent(args.id, context.app.discordClient);

			return true;
		},
	},
};
