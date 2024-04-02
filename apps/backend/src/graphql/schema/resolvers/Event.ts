import { EventType } from "@frcn/shared";
import type { EventRsvpRole, EventSettings, EventUser, Event, User, EventChannel } from "@prisma/client";
import { ChannelType, type GuildChannel } from "discord.js";

import { resolveDiscordEmoji } from "./Discord";
import { resolveUserRole } from "./Roles";
import type { WithModel } from "./types";
import { resolveUser } from "./User";
import { $discord } from "../../../services/discord";
import { $events } from "../../../services/events";
import { $roles } from "../../../services/roles";
import type {
	User as GQLUser,
	Event as GQLEvent,
	EventRsvp as GQLEventRsvp,
	EventRsvpRole as GQLEventRsvpRole,
	EventMember as GQLEventMember,
	EventSettings as GQLEventSettings,
	EventChannel as GQLEventChannel,
	Resolvers
} from "../../__generated__/resolvers-types";
import { EventAccessType } from "../../__generated__/resolvers-types";
import type { GQLContext } from "../../context";
import { gqlErrorBadInput, gqlErrorBadState, gqlErrorUnauthenticated } from "../gqlError";

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
		teams: [], // field-resolved
		mentions: event.discordMentions,
		settings: null as unknown as GQLEventSettings, // field-resolved
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
	} satisfies GQLEventSettings;
}

function resolveEventMember(member: EventUser) {
	return {
		_model: member,
		id: member.id,
		pending: member.pending,
		user: null as unknown as GQLUser, // field-resolved
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
		event: null as unknown as GQLEvent, // field-resolved
		rsvp: null, // field-resolved
		rsvpAt: rsvp.createdAt.getTime(),
	} satisfies WithModel<GQLEventRsvp, EventUser>;
}

export async function resolveEventChannel(channel: EventChannel, context: GQLContext) {
	const guildChannel = (await $discord.getChannel(
		context.app.discordClient,
		channel.discordId
	)) as GuildChannel | null;

	return {
		_model: channel,
		id: channel.id,
		discordId: channel.discordId,
		name: guildChannel ? `#${guildChannel.name}` : `#ERROR-${channel.discordId}`,
		type: guildChannel ? ChannelType[guildChannel.type] : "Unknown",
		events: [] // field-resolved
	} satisfies WithModel<GQLEventChannel, EventChannel>;
}

export const eventResolvers: Resolvers = {
	Event: {
		async channel(source, args, context) {
			const { _model } = source as WithModel<GQLEvent, Event>;
			const channel = await $events.getEventChannel(_model.id);
			if (!channel) return null;
			return await resolveEventChannel(channel, context);
		},
		async owner(source): Promise<WithModel<GQLUser, User> | null> {
			const { _model } = source as WithModel<GQLEvent, Event>;
			const owner = await $events.getEventOwner(_model.id);
			if (!owner) return null;
			return resolveUser(owner);
		},
		async location(source, args, context) {
			const { _model } = source as WithModel<GQLEvent, Event>;
			const owner = await $events.getEventOwner(_model.id);
			const settings = await $events.getEventSettings(_model.id);

			if (
				settings!.hideLocation &&
				context.user?.id !== owner?.id &&
				(!_model.startAt || _model.startAt > new Date())
			) {
				return null;
			}

			return _model.location;
		},
		async rsvp(source, args, context) {
			if (!context.user) return null;
			const { _model } = source as WithModel<GQLEvent, Event>;
			const currentRsvp = await $events.getUserRsvp(_model, context.user)
			if (!currentRsvp) return null;
			return resolveEventMember(currentRsvp)
		},
		async roles(source, args, context) {
			const { _model } = source as WithModel<GQLEvent, Event>;
			const rsvpRoles = await $events.getRSVPRoles(_model.id);
			rsvpRoles.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
			return rsvpRoles.map((role) => resolveEventRsvpRole(role, context));
		},
		async members(source) {
			const { _model } = source as WithModel<GQLEvent, Event>;
			const members = await $events.getEventMembers(_model.id);
			return members.map(resolveEventMember);
		},
		async settings(source) {
			const { _model } = source as WithModel<GQLEvent, Event>;
			const settings = await $events.getEventSettings(_model.id);
			return resolveEventSettings(settings!);
		},
		async accessRoles(source) {
			const { _model } = source as WithModel<GQLEvent, Event>;
			const accessRoles = await $events.getEventAccessRoles(_model.id, {
				include: {
					role: true
				}
			});
			return accessRoles.map(r => r.role).map(resolveUserRole);
		},
	},

	EventRsvpRole: {
		async members(source) {
			const { _model } = source as WithModel<GQLEventRsvpRole, EventRsvpRole>;
			const members = await $events.getRSVPMembers(_model.id);
			return members.map((member) => member.id);
		},
	},

	EventMember: {
		async user(source) {
			const { _model } = source as WithModel<GQLEventMember, EventUser>;
			const user = await $events.getEventMemberUser(_model.id);
			return resolveUser(user!);
		},
	},

	EventRsvp: {
		async event(source) {
			const { _model } = source as WithModel<GQLEventRsvp, EventUser>;
			const event = await $events.getEventMemberEvent(_model.id);
			return resolveEvent(event!);
		},
		async rsvp(source, args, context) {
			const { _model } = source as WithModel<GQLEventRsvp, EventUser>;
			const rsvp = await $events.getEventMemberRsvp(_model.id);
			if (!rsvp) return null;
			return resolveEventRsvpRole(rsvp, context);
		},
	},

	EventChannel: {
		async events(source) {
			const { _model } = source as WithModel<GQLEventChannel, EventChannel>;
			const events = await $events.getEventsInChannel(_model.id)
			return events.map(resolveEvent)
		}
	},

	Query: {
		async getEvent(source, args, context): Promise<WithModel<GQLEvent, Event> | null> {
			const event = await $events.getEvent(args.id);
			if (!event) return null;

			if (!$events.canSeeEvent(event, context.user, context.app.discordClient))
				return null;
			return resolveEvent(event);
		},
		async getEvents(source, { filter, page, limit }, context) {
			const { search, eventType, minStartAt, maxStartAt, minDuration, maxDuration, includeCompleted } = filter ?? {};

			if (
				eventType &&
				!(Object.values(EventType) as string[]).includes(eventType)
			) {
				throw gqlErrorBadInput(`Event type not allowed: ${eventType}`);
			}

			if (minStartAt && maxStartAt && minStartAt > maxStartAt) {
				throw gqlErrorBadInput("Range not allowed: `maxStartAt` must be greater than `minStartAt`")
			}

			if (minDuration && maxDuration && minDuration > maxDuration) {
				throw gqlErrorBadInput("Range not allowed: `maxDuration` must be greater than `minDuration`")
			}

			const result = await $events.getEvents(
				{
					search: search ?? undefined,
					eventType: eventType as EventType,
					startAt: {
						min: minStartAt ?? undefined,
						max: maxStartAt ?? undefined,
					},
					duration: {
						min: minDuration ?? undefined,
						max: maxDuration ?? undefined,
					},
					includeCompleted: includeCompleted ?? false
				},
				page ?? undefined,
				limit ?? undefined,
				context.user,
				context.app.discordClient
			);

			return {
				items: await Promise.all(result.items.map((event) => resolveEvent(event))),
				itemsPerPage: result.itemsPerPage,
				page: result.page,
				nextPage: result.nextPage,
				prevPage: result.prevPage,
				total: result.total,
			};
		},
	},

	Mutation: {
		async createEvent(source, args, context) {
			if (!context.user) throw gqlErrorUnauthenticated();

			const event = await $events.createEvent(
				context.user,
				context.app.discordClient
			);
			return event.id;
		},
		async editEvent(source, args, context): Promise<WithModel<GQLEvent, Event> | null> {
			const event = await $events.getEvent(args.id);
			if (!event) return null;

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
					const roles = await $roles.getAllRoles({
						select: { id: true, primary: true },
					});

					for (const roleId of data.accessRoles ?? []) {
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
				event,
				data,
				context.app.discordClient
			);
			return updatedEvent && resolveEvent(updatedEvent);
		},
		async postEvent(source, args, context) {
			const event = await $events.getEvent(args.id);
			if (!event) return false;
			if (event.posted) return true;

			if (!event.name) throw gqlErrorBadState("Event is missing name");
			if (!event.eventType) throw gqlErrorBadState("Event is missing type");
			if (!event.startAt) throw gqlErrorBadState("Event is missing start date");
			if (!event.duration) throw gqlErrorBadState("Event is missing duration");

			const eventChannel = await $events.getEventChannel(event.id)
			if (!eventChannel) throw gqlErrorBadState("Event is missing channel");

			if (
				event.accessType === EventAccessType.PrimaryRole ||
				event.accessType === EventAccessType.SelectRoles
			) {
				const accessRoles = await $events.getEventAccessRoles(event.id);
				if (accessRoles.length < 1) {
					throw gqlErrorBadState("Event expected an access role");
				}
			}

			const roles = await $events.getRSVPRoles(event.id);
			if (roles.length < 1) {
				throw gqlErrorBadState("Event expected atleast 1 role");
			}

			await $events.postEvent(event, context.app.discordClient);

			return true;
		},
		async deleteEvent(source, args, context) {
			const event = await $events.getEvent(args.id)
			if (!event) return false;

			await $events.deleteEvent(args.id, context.app.discordClient)
			return true;
		},
		async rsvpForEvent(source, args, context) {
			if (!context.user) throw gqlErrorUnauthenticated()
			const event = await $events.getEvent(args.id)
			if (!event) return false;

			const roles = await $events.getRSVPRoles(event.id);
			const role = roles.find(r => r.id === args.rsvp)
			if (!role) throw gqlErrorBadInput("No such rsvp role with id")
			if (!(await $events.canJoinRsvp(role))) throw gqlErrorBadInput(`RSVP '${role.name}' is full`)
			
			const currentRsvp = await $events.getUserRsvp(event, context.user);

			await $events.rsvpForEvent(event, role, context.user, currentRsvp, context.app.discordClient);
			return true
		},
		async unrsvpForEvent(source, args, context) {
			if (!context.user) throw gqlErrorUnauthenticated()
			const event = await $events.getEvent(args.id)
			if (!event) return false;

			await $events.unrsvpForEvent(event, context.user, context.app.discordClient);
			return true
		}
	},
};
