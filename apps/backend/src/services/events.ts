import { randomUUID } from "crypto";

import type { EventType } from "@frcn/shared";
import type { Event, EventRsvpRole, EventUser, Prisma, User } from "@prisma/client";
import { Client as DiscordClient } from "discord.js";

import { $discord } from "./discord";
import { $roles } from "./roles";
import { $system } from "./system";
import { deleteEventMessage, postEventMessage, updateEventMessage } from "../bot/messages/event.message";
import { database } from "../database";
import { EventAccessType, type EventEditInput } from "../graphql/__generated__/resolvers-types";

async function eventExists(id: string) {
	const exists = await database.event.findUnique({
		where: { id },
		select: { id: true },
	});
	return !!exists;
}

async function getEvent(id: string) {
	const event = await database.event.findUnique({
		where: { id },
	});
	return event;
}

async function getEventFromMessageId(id: string) {
	const event = await database.event.findFirst({
		where: { discordEventMessageId: id },
	})
	return event
}

type GetEventsFilter = {
	search?: string;
	eventType?: EventType,
	startAt?: { min?: Date, max?: Date };
	duration?: { min?: number; max?: number };
	includeCompleted?: boolean
};

async function getEvents(
	filter: GetEventsFilter,
	page: number = 0,
	limit: number = -1,
	user: User | undefined,
	discordClient: DiscordClient
) {
	const { search, eventType, startAt = {}, duration, includeCompleted } = filter;

	if (!includeCompleted) {
		startAt.min ??= new Date()
	}

	// If the date range is less than or equal to a calendar range then don't limit items
	if (limit === -1 && startAt.min && startAt.max && new Date(startAt.min.getTime() + 45 * 24 * 3600 * 1000) >= startAt.max) {
		limit = -1;
	} else {
		if (limit === -1) limit = 20;
		limit = Math.min(100, limit);
	}
	
	const expiredDuration = 24 * 3600 * 1000
	const expiredDate = new Date(Date.now() - expiredDuration)
	const startAtOr: Prisma.EventWhereInput[] = [
		{
			startAt: {
				gte: startAt.min,
				lte: startAt.max
			},
		}
	]

	// Show live events if they haven't expired and are in our selected date range
	if (startAt.min && expiredDate >= new Date(startAt.min.getTime() - expiredDuration) && (!startAt.max || startAt.max > new Date())) {
		startAtOr.push({
			startAt: {
				lt: startAt.min,
				gte: new Date(Date.now() - 24 * 3600 * 1000)
			},
			endedAt: null,
		})
	}

	const result = await database.event.findMany({
		where: {
			name: search
				? {
					contains: search,
					mode: "insensitive"
				  }
				: undefined,
			eventType,
			posted: true,
			duration: duration
				? {
						gte: duration.min,
						lte: duration.max,
				  }
				: undefined,
			OR: startAtOr,
		},
		orderBy: [
			{
				startAt: "asc",
			},
			{
				createdAt: "asc",
			},
		],
		include: {
			members: true,
			accessRoles: true,
			channel: true,
		},
	});

	const predicate = await Promise.all(
		result.map(async (event) => {
			return await canSeeEvent(event, user, discordClient);
		})
	);
	const filteredResult = result.filter((_, index) => predicate[index]);
	const pageItems = limit === -1 ? filteredResult : filteredResult.slice(page * limit, (page + 1) * limit);

	return {
		items: pageItems,
		total: filteredResult.length,
		itemsPerPage: limit,
		page,
		nextPage: limit > 0 && (page + 1) * limit < filteredResult.length ? page + 1 : null,
		prevPage: limit > 0 && page > 0 ? page - 1 : null,
	};
}

async function createEvent(owner: User, discordClient: DiscordClient) {
	const { defaultEventChannel } = await $system.getSystemSettings();
	if (!defaultEventChannel) throw new Error("No default event channel")
	const guild = await $discord.getGuild(discordClient);

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
			roles: {
				create: {
					name: "I am interested",
					emoji: "white_check_mark",
					emojiId: "white_check_mark",
					limit: 0,
				},
			},
			discordMentions: [guild.roles.everyone.id],
			settings: {
				create: {
					hideLocation: false,
					inviteOnly: false,
					openToJoinRequests: true,
					allowTeamSwitching: false,
				},
			},
			accessType: EventAccessType.Channel,
			posted: false,
		},
	});

	return event;
}

async function editEvent(id: string, data: EventEditInput, discordClient: DiscordClient) {
	const event = await database.event.findUnique({
		where: { id },
		select: {
			roles: true,
		},
	});

	if (!event) return null;

	const updatedEvent = await database.event.update({
		where: { id },
		data: {
			channel: data.channel
				? {
						connect: {
							discordId: data.channel,
						},
				  }
				: undefined,
			name: data.name != null ? data.name : undefined,
			summary: data.summary != null ? data.summary : undefined,
			description: data.description != null ? data.description : undefined,
			imageUrl: data.imageUrl,
			eventType: data.eventType ? data.eventType : undefined,
			location: data.location ? data.location : undefined,
			startAt: data.startAt != null ? data.startAt : undefined,
			duration: data.duration != null ? data.duration : undefined,
			roles: data.roles
				? {
						createMany: {
							data: data.roles
								.filter((r) => !event.roles.find((r1) => r1.id === r.id))
								.map((r) => ({
									id: randomUUID(),
									name: r.name,
									emoji: r.emoji,
									emojiId: r.emojiId,
									limit: r.limit,
								})),
						},
						updateMany: data.roles
							.filter((r) => !!event.roles.find((r1) => r1.id === r.id))
							.map((r) => ({
								where: { id: r.id },
								data: {
									name: r.name,
									emoji: r.emoji,
									emojiId: r.emojiId,
									limit: r.limit,
								},
							})),
					deleteMany: event.roles.filter(r => !data.roles!.find(r1 => r1.id === r.id)).map(r => ({
							id: r.id
						}))
				  }
				: undefined,
			discordMentions: data.mentions ? data.mentions : undefined,
			settings: data.settings
				? {
						update: {
							hideLocation: data.settings.hideLocation,
							inviteOnly: data.settings.inviteOnly,
							openToJoinRequests: data.settings.openToJoinRequests,
							allowTeamSwitching: data.settings.allowTeamSwitching,
						},
				  }
				: undefined,
			accessType: data.accessType ? data.accessType : undefined,
			accessRoles: data.accessRoles
				? {
						deleteMany: data.accessRoles.length === 0 ? {} : undefined,
						connectOrCreate: data.accessRoles.map((roleId) => ({
							where: { roleId_eventId: { eventId: id, roleId } },
							create: {
								roleId,
							},
						})),
				  }
				: undefined,
		},
		include: {
			channel: true,
		},
	});

	await updateEventMessage(discordClient, updatedEvent)

	return updatedEvent;
}

async function postEvent(id: string, discordClient: DiscordClient) {
	const event = await database.event.findUnique({
		where: { id },
		include: {
			channel: true,
		},
	});
	if (!event) return;
	
	await postEventMessage(discordClient, event)
}

async function deleteEvent(id: string, discordClient: DiscordClient) {
	const event = await database.event.findUnique({
		where: { id },
		include: {
			channel: true,
		},
	});
	if (!event) return;

	await deleteEventMessage(discordClient, event)
	await database.event.delete({
		where: { id },
	})
}

async function getUserRsvp(event: Event, user: User) {
	const members = await database.event.getMembers(event)
	return members.find(member => member.userId === user.id) ?? null
}

async function canJoinRsvp(rsvp: EventRsvpRole) {
	if (rsvp.limit === 0) return true;

	const members = await database.eventRsvpRole.getMembers(rsvp)
	return members.length < rsvp.limit 
}

async function getEventThread(event: Event, discordClient: DiscordClient) {
	if (!event.discordThreadId) throw new Error("Event has no thread!")
	const thread = await $discord.getChannel(discordClient, event.discordThreadId)
	if (!thread?.isThread()) throw new Error("Could not find thread or channel is not a thread")
	return thread;
}

async function rsvpForEvent(event: Event, rsvp: EventRsvpRole, user: User, currentRsvp: EventUser | null, discordClient: DiscordClient) {
	if (!(await canJoinRsvp(rsvp))) throw new Error(`Cannot rsvp to ${rsvp.name}, role is full`)
	
	const updatedEvent = await database.event.update({
		where: { id: event.id },
		data: {
			members: {
				create: !currentRsvp ? {
					pending: false,
					rsvp: {
						connect: {
							id: rsvp.id
						}
					},
					user: {
						connect: {
							id: user.id
						}
					}
				} : undefined,
				update: currentRsvp ? {
					where: { id: currentRsvp.id },
					data: {
						rsvp: rsvp.id !== currentRsvp.rsvpId ? {
							connect: {
								id: rsvp.id
							}
						} : undefined,
						pending: false
					}
				} : undefined
			}
		}
	})

	await updateEventMessage(discordClient, updatedEvent)

	try {
		const thread = await getEventThread(updatedEvent, discordClient)
		await thread.members.add(user.discordId, "RSVPed")
	} catch (err) {
		console.error("Failed to add user to event thread")
		console.error(err)
	}
}

async function unrsvpForEvent(event: Event, user: User, discordClient: DiscordClient) {
	const currentRsvp = await getUserRsvp(event, user)
	if (!currentRsvp) return;

	const updatedEvent = await database.event.update({
		where: { id: event.id },
		data: {
			members: {
				delete: {
					id: currentRsvp.id
				}
			}
		}
	})

	await updateEventMessage(discordClient, updatedEvent)

	try {
		const thread = await getEventThread(updatedEvent, discordClient)
		await thread.members.remove(user.discordId, "UnRSVPed")
	} catch (err) {
		console.error("Failed to add user to event thread")
		console.error(err)
	}
}

async function canSeeEvent(event: Event, user: User | undefined, discordClient: DiscordClient) {
	if (event.ownerId === user?.id) return true;
	if (event.accessType === EventAccessType.Everyone) return true;

	const members = await database.event.getMembers(event);
	if (user && members.some((member) => member.userId == user.id)) return true;

	switch (event.accessType as EventAccessType) {
		case EventAccessType.Everyone:
			return true;
		case EventAccessType.PrimaryRole: {
			if (!user) return false;

			const accessThroughRoles = await database.event.getAccessThroughRoles(event);
			if (accessThroughRoles.length === 0) return false;

			const primaryRole = await database.eventsWithUserRoleForAccess.getRole(accessThroughRoles[0]);
			return $roles.hasPrimaryRolePrivileges(primaryRole, user);
		}
		case EventAccessType.SelectRoles: {
			if (!user) return false;

			const accessRoles = await database.event.getAccessRoles(event);
			return await $roles.hasOneOfRoles(accessRoles, user);
		}
		case EventAccessType.Channel: {
			const channel = await database.event.getChannel(event);
			return await $discord.canUserViewChannel(discordClient, user, channel.discordId);
		}
	}
}

async function eventChannelExists(id: string) {
	const channel = await database.eventChannel.findUnique({
		where: {
			discordId: id,
		},
	});
	return !!channel;
}

export const $events = {
	eventExists,
	getEvent,
	getEventFromMessageId,
	getEvents,
	createEvent,
	editEvent,
	postEvent,
	deleteEvent,
	canSeeEvent,
	getUserRsvp,
	canJoinRsvp,
	getEventThread,
	rsvpForEvent,
	unrsvpForEvent,
	eventChannelExists,
};
