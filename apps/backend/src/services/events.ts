import { randomUUID } from "crypto";

import type { EventType } from "@frcn/shared";
import type {
	Event,
	EventChannel,
	EventRsvpRole,
	EventSettings,
	EventUser,
	Prisma,
	User
} from "@prisma/client";
import {
	ChannelType,
	TextChannel,
	type GuildBasedChannel,
	ThreadAutoArchiveDuration,
	VideoQualityMode,
	Guild,
	ThreadChannel
} from "discord.js";

import { $discord } from "./discord";
import { $roles } from "./roles";
import { $system } from "./system";
import type { DiscordClient } from "../bot";
import {
	deleteEventMessage,
	postEventMessage,
	updateEventMessage
} from "../bot/messages/event.message";
import { updateEventChannelCalendarMessage } from "../bot/messages/eventChannelCalendar.message";
import { postEventEndMessage } from "../bot/messages/eventStartEnd.message";
import { postEventUpdateMessage } from "../bot/messages/eventUpdate.message";
import type { Context } from "../context";
import { database } from "../database";
import {
	EventAccessType,
	type EventChannelEditInput,
	type EventEditInput
} from "../graphql/__generated__/resolvers-types";
import { logger } from "../logger";
import { insertEventIntoLegionCoda } from "../integrations/coda";

const EVENT_EXPIRE_AFTER = 24 * 3600 * 1000;

export enum EventReminder {
	OnStart = "ON_START",
	OnEnd = "ON_END",
	StartSoon = "START_SOON",
	TenMinutesBefore = "TEN_MINUTES",
	OneHourBefore = "ONE_HOUR",
	OneDayBefore = "ONE_DAY",
	OneWeekBefore = "ONE_WEEK"
}

async function getEvent(id: string) {
	const event = await database.event.findUnique({
		where: { id }
	});
	return event;
}

async function getEventFromMessageId(id: string) {
	const event = await database.event.findFirst({
		where: { discordEventMessageId: id }
	});
	return event;
}

type GetEventsFilter = {
	search?: string;
	eventType?: EventType;
	startAt?: { min?: Date; max?: Date };
	duration?: { min?: number; max?: number };
	includeCompleted?: boolean;
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
		startAt.min ??= new Date();
	}

	// If the date range is less than or equal to a calendar range then don't limit items
	if (
		limit === -1 &&
		startAt.min &&
		startAt.max &&
		new Date(startAt.min.getTime() + 45 * 24 * 3600 * 1000) >= startAt.max
	) {
		limit = -1;
	} else {
		if (limit === -1) limit = 20;
		limit = Math.min(100, limit);
	}

	const startAtOr: Prisma.EventWhereInput[] = [];

	if (startAt.min || startAt.max) {
		startAtOr.push({
			startAt: {
				gte: startAt.min,
				lte: startAt.max
			}
		});
	}

	// Show live events if they haven't expired and are in our selected date range
	if (startAt.min && (!startAt.max || startAt.max > new Date())) {
		startAtOr.push({
			startAt: {
				lt: startAt.min,
				gte: new Date(Date.now() - EVENT_EXPIRE_AFTER)
			},
			endedAt: null
		});
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
						lte: duration.max
				  }
				: undefined,
			OR: startAtOr.length > 0 ? startAtOr : undefined
		},
		orderBy: [
			{
				startAt: "asc"
			},
			{
				createdAt: "asc"
			}
		],
		include: {
			members: true,
			accessRoles: true,
			channel: true
		}
	});

	const predicate = await Promise.all(
		result.map(async (event) => {
			return await canSeeEvent(event, user, discordClient);
		})
	);
	const filteredResult = result.filter((_, index) => predicate[index]);
	const pageItems =
		limit === -1 ? filteredResult : filteredResult.slice(page * limit, (page + 1) * limit);

	return {
		items: pageItems,
		total: filteredResult.length,
		itemsPerPage: limit,
		page,
		nextPage: limit > 0 && (page + 1) * limit < filteredResult.length ? page + 1 : null,
		prevPage: limit > 0 && page > 0 ? page - 1 : null
	};
}

async function getUpcomingEvents(maxTimeInFutureMs?: number) {
	const now = Date.now();
	return await database.event.findMany({
		where: {
			posted: true,
			archived: false,
			endedAt: null,
			startAt: maxTimeInFutureMs
				? {
						lte: new Date(now + maxTimeInFutureMs)
				  }
				: undefined
		},
		include: {
			channel: true
		}
	});
}

async function getEndingEvents() {
	const now = Date.now();
	return await database.event.findMany({
		where: {
			posted: true,
			archived: false,
			startAt: {
				lt: new Date(now)
			},
			endedAt: null
		},
		include: {
			channel: {
				select: {
					discordId: true
				}
			}
		}
	});
}

async function getEventsInChannel(id: number) {
	return await database.event.findMany({
		where: {
			channelId: id
		}
	});
}

async function getEventEventChannel<T extends Prisma.Event$channelArgs>(
	id: string,
	args?: Prisma.Subset<T, Prisma.Event$channelArgs>
) {
	const result = await database.event
		.findUnique({
			where: { id }
		})
		.channel<T>(args);
	return result;
}

async function getEventDiscordChannel(event: Event, discordClient: DiscordClient) {
	const eventChannel = await getEventEventChannel(event.id);
	if (!eventChannel) throw new Error("Event has no event channel");

	const channel = await $discord.getChannel(
		discordClient,
		eventChannel.discordId,
		eventChannel.discordGuildId ?? undefined
	);
	if (!channel?.isTextBased() || !(channel instanceof TextChannel))
		throw new Error("Could not find event channel, or channel is somehow not text based");
	return channel;
}

async function getEventThread(discordClient: DiscordClient, event: Event, role?: EventRsvpRole) {
	if ((role && !role.discordThreadId) || (!role && !event.discordThreadId))
		throw new Error("Event has no thread!");

	const eventChannel = event.channelId ? await getEventChannel(event.channelId) : null;

	const thread = await $discord.getChannel(
		discordClient,
		role ? role.discordThreadId! : event.discordThreadId!,
		eventChannel?.discordGuildId ?? undefined
	);
	if (!thread?.isThread()) throw new Error("Could not find thread or channel is not a thread");

	return thread;
}

async function createEventThread(
	event: Event,
	discordClient: DiscordClient,
	channel?: TextChannel,
	role?: EventRsvpRole
) {
	channel ??= await getEventDiscordChannel(event, discordClient);
	const settings = await getEventSettings(event.id);
	if ((role && !settings?.createThreadsForRoles) || (!role && !settings?.createEventThread))
		return null;

	let threadName = role ? `${event.name.slice(0, 11)}.. | ${role.name}` : event.name;
	const thread = await channel!.threads.create({
		name: threadName,
		type: ChannelType.PrivateThread,
		reason:
			"Create thread for event: " + event.name + (role ? ` for RSVP role ${role.name}` : ""),
		autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
		invitable: false
	});

	const owner = await getEventOwner(event.id);
	if (owner) {
		try {
			await thread.members.add(owner.discordId, "Is event owner");
		} catch (err) {
			logger.error("Failed to add event owner to event thread", err);
		}
	}

	const rsvps = role
		? await getRSVPMembers(role.id, {
				include: {
					user: {
						select: {
							discordId: true
						}
					}
				}
		  })
		: await getEventMembers(event.id, {
				include: {
					user: {
						select: {
							discordId: true
						}
					}
				}
		  });

	for (const rsvp of rsvps) {
		if (!rsvp.user || thread.members.cache.has(rsvp.user.discordId)) continue;
		try {
			await thread.members.add(rsvp.user.discordId, "RSVPed");
		} catch (err) {
			logger.error("Failed to add user to event thread", err);
		}
	}

	return thread;
}

async function tryCreateEventThread(
	discordClient: DiscordClient,
	event: Event & { settings?: EventSettings | null },
	channel: TextChannel,
	role?: EventRsvpRole
) {
	const flag = role ? event.settings?.createThreadsForRoles : event.settings?.createEventThread;

	let createThread = (role ? !role.discordThreadId : !event.discordThreadId) && flag;

	let thread: ThreadChannel | null = null;
	if (!createThread && flag) {
		try {
			thread = await getEventThread(discordClient, event, role);
		} catch (err) {
			createThread = true;
		}
	}

	if (createThread) {
		thread = await createEventThread(event, discordClient, channel, role);
	}

	return { thread, created: createThread };
}

async function renameEventThread(discordClient: DiscordClient, event: Event) {
	if (!event.posted || !event.discordThreadId) return;

	try {
		const thread = await getEventThread(discordClient, event);
		await thread.setName(event.name);
	} catch (err) {
		logger.error("Failed to rename event thread", err);
	}

	const roles = await getRSVPRoles(event.id);
	for (const role of roles) {
		if (!role.discordThreadId) continue;
		try {
			const thread = await getEventThread(discordClient, event, role);
			await thread.setName(`${event.name.slice(0, 11)}.. | ${role.name}`);
		} catch (err) {
			logger.error("Failed to rename event role thread", err);
		}
	}
}

async function archiveEventThreads(discordClient: DiscordClient, event: Event) {
	if (!event.posted || !event.discordThreadId) return;

	try {
		const thread = await getEventThread(discordClient, event);
		await thread.setArchived(true);
	} catch (err) {
		logger.error("Failed to archive event thread", err);
	}

	const roles = await getRSVPRoles(event.id);
	for (const role of roles) {
		if (!role.discordThreadId) continue;
		try {
			const thread = await getEventThread(discordClient, event, role);
			await thread.setArchived(true);
		} catch (err) {
			logger.error("Failed to archive event role thread", err);
		}
	}
}

async function deleteEventThreads(discordClient: DiscordClient, event: Event) {
	if (!event.posted || !event.discordThreadId) return;

	try {
		const thread = await getEventThread(discordClient, event);
		await thread.delete();
	} catch (err) {
		logger.error("Failed to delete event thread", err);
	}

	const roles = await getRSVPRoles(event.id);
	for (const role of roles) {
		if (!role.discordThreadId) continue;
		try {
			const thread = await getEventThread(discordClient, event, role);
			await thread.delete();
		} catch (err) {
			logger.error("Failed to delete event role thread", err);
		}
	}
}

async function getEventOwner<T extends Prisma.Event$ownerArgs>(
	id: string,
	args?: Prisma.Subset<T, Prisma.Event$ownerArgs>
) {
	const result = await database.event
		.findUnique({
			where: { id }
		})
		.owner<T>(args);
	return result;
}

async function getEventSettings<T extends Prisma.Event$settingsArgs>(
	id: string,
	args?: Prisma.Subset<T, Prisma.Event$settingsArgs>
) {
	const result = await database.event
		.findUnique({
			where: { id }
		})
		.settings<T>(args);
	return result;
}

async function getEventMember(id: string) {
	return await database.eventUser.findUnique({
		where: { id }
	});
}

async function getEventMembers<T extends Omit<Prisma.Event$membersArgs, "where">>(
	id: string,
	args?: Prisma.Subset<T, Prisma.Event$membersArgs>
) {
	return await getEventRsvps<T>(id, {
		...args,
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore not sure how to fix this type
		where: {
			rsvpId: {
				not: null
			}
		}
	});
}

async function getEventRsvps<T extends Prisma.Event$membersArgs>(
	id: string,
	args?: Prisma.Subset<T, Prisma.Event$membersArgs>
) {
	const result = await database.event
		.findUnique({
			where: { id }
		})
		.members<T>(args);
	return result ?? [];
}

async function getEventMemberUser<T extends Prisma.UserDefaultArgs>(
	id: string,
	args?: Prisma.Subset<T, Prisma.UserDefaultArgs>
) {
	const result = await database.eventUser
		.findUnique({
			where: { id }
		})
		.user<T>(args);
	return result;
}

async function getEventMemberEvent<T extends Prisma.EventDefaultArgs>(
	id: string,
	args?: Prisma.Subset<T, Prisma.EventDefaultArgs>
) {
	const result = await database.eventUser
		.findUnique({
			where: { id }
		})
		.event<T>(args);
	return result;
}

async function getEventMemberRsvp<T extends Prisma.EventUser$rsvpArgs>(
	id: string,
	args?: Prisma.Subset<T, Prisma.EventUser$rsvpArgs>
) {
	const result = await database.eventUser
		.findUnique({
			where: { id }
		})
		.rsvp<T>(args);
	return result;
}

async function kickEventMember(member: EventUser, discordClient: DiscordClient) {
	const rsvp = await getEventMemberRsvp(member.id);
	const updatedMember = await database.eventUser.update({
		where: { id: member.id },
		data: {
			rsvp: {
				disconnect: true
			}
		},
		include: {
			user: {
				select: {
					discordId: true
				}
			},
			event: true
		}
	});

	if (!updatedMember.event.posted) return;
	await updateEventMessage(discordClient, updatedMember.event);

	if (updatedMember.user && updatedMember.user.discordId !== updatedMember.event.ownerId) {
		if (updatedMember.event.discordThreadId) {
			try {
				const thread = await getEventThread(discordClient, updatedMember.event);
				await thread.members.remove(
					updatedMember.user.discordId,
					"UnRSVPed / Kicked from event"
				);
			} catch (err) {
				logger.error("Failed to remove user to event thread", err);
			}
		}

		if (rsvp?.discordThreadId) {
			try {
				const thread = await getEventThread(discordClient, updatedMember.event, rsvp);
				await thread.members.remove(
					updatedMember.user.discordId,
					"UnRSVPed / Kicked from event"
				);
			} catch (err) {
				logger.error("Failed to remove user to event role thread", err);
			}
		}
	}
}

async function getEventAccessRoles<T extends Prisma.Event$accessRolesArgs>(
	id: string,
	args?: Prisma.Subset<T, Prisma.Event$accessRolesArgs>
) {
	const result = await database.event
		.findUnique({
			where: { id }
		})
		.accessRoles<T>(args);
	return result ?? [];
}

async function getRSVPRoles<T extends Prisma.Event$rolesArgs>(
	id: string,
	args?: Prisma.Subset<T, Prisma.Event$rolesArgs>
) {
	const result = await database.event
		.findUnique({
			where: { id }
		})
		.roles<T>(args);
	return result ?? [];
}

async function getRSVPMembers<T extends Prisma.EventRsvpRole$membersArgs>(
	id: string,
	args?: Prisma.Subset<T, Prisma.EventRsvpRole$membersArgs>
) {
	const result = await database.eventRsvpRole
		.findUnique({
			where: { id }
		})
		.members<T>(args);
	return result ?? [];
}

async function getUserRsvp(event: Event, user: User) {
	const rsvps = await getEventRsvps(event.id);
	return rsvps.find((rsvp) => rsvp.userId === user.id) ?? null;
}

async function setUserReminder(rsvp: EventUser, reminder: EventReminder) {
	return await database.eventUser.update({
		where: { id: rsvp.id },
		data: {
			reminders: rsvp.reminders.includes(reminder)
				? rsvp.reminders.filter((r) => r !== reminder)
				: [...rsvp.reminders, reminder]
		}
	});
}

async function setEventReminder(event: Event, reminder: EventReminder) {
	if (event.remindersSent.includes(reminder)) return event;

	const remindersSent = [...event.remindersSent, reminder];
	event.remindersSent = remindersSent;

	return await database.event.update({
		where: { id: event.id },
		data: {
			remindersSent
		}
	});
}

async function createEvent(owner: User, startAt: Date | undefined, discordClient: DiscordClient) {
	const { defaultEventChannel } = await $system.getSystemSettings();
	if (!defaultEventChannel) throw new Error("No default event channel");

	const guild = await $discord.getSystemGuild(discordClient);
	if (!guild) throw new Error("Could not fetch guild");

	const discordChannel = await $discord.getChannel(discordClient, defaultEventChannel.discordId);
	if (!discordChannel) throw new Error("Could not fetch default event discord channel");

	const discordCategory = await $discord.getChannel(
		discordClient,
		defaultEventChannel.discordCategoryId
	);
	if (!discordCategory) throw new Error("Could not fetch default event channel discord category");

	if (!(await $discord.canPostInChannel(discordChannel)))
		throw new Error("Cannot post messages in default event channel");
	if (!(await $discord.canCreateThreadInChannel(discordChannel)))
		throw new Error("Cannot create threads in default event channel");
	if (!(await $discord.canManageChannelsInCategory(discordCategory)))
		throw new Error("Cannot manage channels in default event channel category");

	const event = await database.event.create({
		data: {
			owner: {
				connect: {
					id: owner.id
				}
			},
			channel: {
				connect: {
					id: defaultEventChannel.id
				}
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
					limit: 0
				}
			},
			discordMentions: [guild.roles.everyone.id],
			settings: {
				create: {
					hideLocation: false,
					inviteOnly: false,
					openToJoinRequests: true
				}
			},
			accessType: EventAccessType.Channel,
			posted: false,
			startAt
		}
	});

	return event;
}

async function editEvent(event: Event, data: EventEditInput, discordClient: DiscordClient) {
	const roles = await getRSVPRoles(event.id);

	const rolesToCreate = (data.roles ?? [])
		.filter((r) => !roles.find((r1) => r1.id === r.id))
		.map((r) => ({
			id: randomUUID(),
			name: r.name,
			emoji: r.emoji,
			emojiId: r.emojiId,
			limit: r.limit
		}));
	const rolesToUpdate = (data.roles ?? []).filter((r) => !!roles.find((r1) => r1.id === r.id));
	const rolesToDelete = data.roles
		? roles.filter((r) => !data.roles!.find((r1) => r1.id === r.id))
		: [];

	const updatedEvent = await database.event.update({
		where: { id: event.id },
		data: {
			channel: data.channel
				? {
						connect: {
							id: data.channel
						}
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
							data: rolesToCreate
						},
						updateMany: rolesToUpdate.map((r) => ({
							where: { id: r.id },
							data: {
								name: r.name,
								emoji: r.emoji,
								emojiId: r.emojiId,
								limit: r.limit
							}
						})),
						deleteMany: rolesToDelete.map((r) => ({
							id: r.id
						}))
				  }
				: undefined,
			discordMentions: data.mentions ? data.mentions : undefined,
			settings: data.settings
				? {
						update: {
							createEventThread: data.settings.createEventThread ?? undefined,
							createThreadsForRoles: data.settings.createThreadsForRoles ?? undefined,
							hideLocation: data.settings.hideLocation ?? undefined,
							inviteOnly: data.settings.inviteOnly ?? undefined,
							openToJoinRequests: data.settings.openToJoinRequests ?? undefined
						}
				  }
				: undefined,
			accessType: data.accessType ? data.accessType : undefined,
			accessRoles: data.accessRoles
				? {
						deleteMany: data.accessRoles.length === 0 ? {} : undefined,
						connectOrCreate: data.accessRoles.map((roleId) => ({
							where: { roleId_eventId: { eventId: event.id, roleId } },
							create: {
								roleId
							}
						}))
				  }
				: undefined
		},
		include: {
			channel: true,
			settings: true,
			roles: true
		}
	});

	await updateEventMessage(discordClient, updatedEvent);
	await renameEventThread(discordClient, updatedEvent);
	await postEventUpdateMessage(discordClient, event, updatedEvent);
	if (updatedEvent.channel) {
		await updateEventChannelCalendarMessage(discordClient, updatedEvent.channel);
	}

	let discordChannel;
	try {
		discordChannel = await getEventDiscordChannel(updatedEvent, discordClient);
	} catch (err) {
		logger.error("Failed to get event discord channel to update threads", err);
	}

	if (discordChannel) {
		for (const dataRole of [
			...rolesToCreate,
			...rolesToUpdate.map((r) => ({ ...r, updated: true }))
		]) {
			const role = updatedEvent.roles.find((r) => r.id === dataRole.id);
			if (!role) continue;

			const { thread, created } = await tryCreateEventThread(
				discordClient,
				updatedEvent,
				discordChannel,
				role
			);
			if (thread && created) {
				await database.eventRsvpRole.update({
					where: { id: role.id },
					data: {
						discordThreadId: thread.id
					}
				});
			}

			if (thread && "updated" in dataRole && !created && dataRole.name !== role.name) {
				try {
					const thread = await getEventThread(discordClient, updatedEvent, role);
					await thread.setName(`${updatedEvent.name.slice(0, 11)}.. | ${dataRole.name}`);
				} catch (err) {
					logger.error("Failed to rename event role thread", err);
				}
			}
		}
	}

	for (const role of rolesToDelete) {
		if (!role.discordThreadId) continue;
		try {
			const thread = await getEventThread(discordClient, updatedEvent, role);
			await thread.delete();
		} catch (err) {
			logger.error("Failed to delete event role thread", err);
		}
	}

	return updatedEvent;
}

async function postEvent(event: Event, discordClient: DiscordClient) {
	const channel = await getEventDiscordChannel(event, discordClient);
	const { messageId, threadId } = await postEventMessage(discordClient, event, channel);

	const updatedEvent = await database.event.update({
		where: { id: event.id },
		data: {
			discordEventMessageId: messageId,
			discordThreadId: threadId,
			posted: true
		},
		include: {
			channel: true,
			roles: true,
			settings: true
		}
	});

	if (updatedEvent.channel) {
		await updateEventChannelCalendarMessage(discordClient, updatedEvent.channel, true);
	}

	if (updatedEvent.settings?.createThreadsForRoles) {
		for (const role of updatedEvent.roles) {
			const { thread, created } = await tryCreateEventThread(
				discordClient,
				updatedEvent,
				channel,
				role
			);
			if (thread && created) {
				await database.eventRsvpRole.update({
					where: { id: role.id },
					data: {
						discordThreadId: thread.id
					}
				});
			}
		}
	}
}

async function unpostEvent(event: Event, discordClient: DiscordClient) {
	await deleteEventThreads(discordClient, event);
	await deleteEventMessage(discordClient, event);
	const unpostedEvent = await database.event.update({
		where: { id: event.id },
		data: {
			discordEventMessageId: null,
			discordThreadId: null,
			posted: false
		},
		include: {
			channel: true
		}
	});

	if (unpostedEvent.channel) {
		await updateEventChannelCalendarMessage(discordClient, unpostedEvent.channel);
	}
}

async function endEvent(event: Event, discordClient: DiscordClient, postMessage = true) {
	await deleteEventMessage(discordClient, event);
	const endedEvent = await database.event.update({
		where: { id: event.id },
		data: {
			endedAt: new Date()
		},
		include: {
			channel: true,
			owner: true,
			members: {
				include: {
					user: {
						select: {
							discordName: true
						}
					}
				}
			}
		}
	});

	if (postMessage) {
		try {
			await postEventEndMessage(discordClient, endedEvent);
		} catch (err) {
			logger.error("Error posting event end message", err);
		}
	}

	if (endedEvent.channel) {
		await updateEventChannelCalendarMessage(discordClient, endedEvent.channel);
	}

	const legionEventId = endedEvent.name.trim().match(/^LGN\d+/);
	if (legionEventId) {
		try {
			await insertEventIntoLegionCoda(legionEventId[0], endedEvent);
		} catch (err) {
			logger.error("Error inserting event into legion coda calendar", err);
		}
	}

	return endedEvent;
}

async function expireEvent(event: Event, discordClient: DiscordClient) {
	if (!event.endedAt) {
		await endEvent(event, discordClient, false);
	}

	return await database.event.update({
		where: { id: event.id },
		data: {
			expired: true
		}
	});
}

async function archiveEvent(event: Event, discordClient: DiscordClient) {
	if (!event.endedAt) {
		await endEvent(event, discordClient, false);
	}

	await archiveEventThreads(discordClient, event);
	return await database.event.update({
		where: { id: event.id },
		data: {
			archived: true,
			archivedAt: new Date()
		}
	});
}

async function deleteEvent(event: Event, discordClient: DiscordClient) {
	if (event.endedAt) return;

	await deleteEventThreads(discordClient, event);
	await deleteEventMessage(discordClient, event);
	const deletedEvent = await database.event.delete({
		where: { id: event.id },
		include: {
			channel: true
		}
	});

	if (deletedEvent.channel) {
		await updateEventChannelCalendarMessage(discordClient, deletedEvent.channel);
	}
}

async function canJoinRsvp(rsvp: EventRsvpRole) {
	if (rsvp.limit === 0) return true;

	const members = await getRSVPMembers(rsvp.id, {
		select: { id: true }
	});
	return members.length < rsvp.limit;
}

async function rsvpForEvent(
	event: Event,
	rsvp: EventRsvpRole,
	user: User,
	currentRsvp: EventUser | null,
	discordClient: DiscordClient
) {
	const canRsvp = await canJoinRsvp(rsvp);
	if (!canRsvp) throw new Error(`Cannot rsvp to ${rsvp.name}, role is full`);

	const currentRsvpRole = currentRsvp ? await getEventMemberRsvp(currentRsvp.id) : null;

	await database.eventUser.upsert({
		where: {
			eventId_userId: {
				eventId: event.id,
				userId: user.id
			}
		},
		create: {
			event: {
				connect: {
					id: event.id
				}
			},
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
		},
		update: {
			pending: false,
			rsvp:
				rsvp.id !== currentRsvp?.rsvpId
					? {
							connect: {
								id: rsvp.id
							}
					  }
					: undefined
		}
	});

	if (!event.posted) return;

	await updateEventMessage(discordClient, event);

	if (event.discordThreadId) {
		try {
			const thread = await getEventThread(discordClient, event);
			await thread.members.add(user.discordId, "RSVPed");
		} catch (err) {
			logger.error("Failed to add user to event thread", err);
		}
	}

	if (currentRsvpRole?.discordThreadId) {
		try {
			const thread = await getEventThread(discordClient, event, currentRsvpRole);
			await thread.members.remove(user.discordId, "Changed role");
		} catch (err) {
			logger.error("Failed to remove user from event role thread", err);
		}
	}

	if (rsvp.discordThreadId) {
		try {
			const thread = await getEventThread(discordClient, event, rsvp);
			await thread.members.add(user.discordId, "RSVPed / Changed role");
		} catch (err) {
			logger.error("Failed to add user to event role thread", err);
		}
	}
}

async function unrsvpForEvent(event: Event, user: User, discordClient: DiscordClient) {
	const currentRsvp = await getUserRsvp(event, user);
	if (!currentRsvp || !currentRsvp.rsvpId) return;

	await kickEventMember(currentRsvp, discordClient);
}

async function canSeeEvent(event: Event, user: User | undefined, discordClient: DiscordClient) {
	if (event.ownerId === user?.id) return true;
	if (event.accessType === EventAccessType.Everyone) return true;

	const members = await getEventMembers(event.id);
	if (user && members.some((member) => member.userId == user.id)) return true;

	switch (event.accessType as EventAccessType) {
		case EventAccessType.Everyone:
			return true;
		case EventAccessType.PrimaryRole: {
			if (!user) return false;

			const accessThroughRoles = await getEventAccessRoles(event.id, {
				include: {
					role: true
				}
			});
			if (accessThroughRoles.length === 0) return false;

			return $roles.hasPrimaryRolePrivileges(accessThroughRoles[0].role, user);
		}
		case EventAccessType.SelectRoles: {
			if (!user) return false;

			const accessRoles = await getEventAccessRoles(event.id, {
				include: {
					role: true
				}
			});
			return await $roles.hasOneOfRoles(
				accessRoles.map((ar) => ar.role),
				user
			);
		}
		case EventAccessType.Channel: {
			const channel = await getEventEventChannel(event.id);
			if (!channel) return false;
			return await $discord.canUserViewChannel(
				discordClient,
				user,
				channel.discordId,
				channel.discordGuildId ?? undefined
			);
		}
	}
}

async function eventChannelExists(discordId: string) {
	const channel = await database.eventChannel.findUnique({
		where: { discordId }
	});
	return !!channel;
}

async function getAllEventChannels() {
	return await database.eventChannel.findMany();
}

async function getEventChannel(id: number) {
	return await database.eventChannel.findUnique({
		where: { id }
	});
}

async function getEventChannelReadyRoom(id: number) {
	return await database.eventVoiceChannel.findFirst({
		where: { channelId: id, readyRoom: true },
		include: {
			channel: {
				select: {
					discordGuildId: true
				}
			}
		}
	});
}

async function getEventChannelVoiceChannels(id: number) {
	const result = await database.eventChannel
		.findUnique({
			where: { id }
		})
		.voiceChannels();
	return result ?? [];
}

async function createEventChannel(
	guild: Guild,
	channel: GuildBasedChannel,
	category: GuildBasedChannel,
	readyRoom?: GuildBasedChannel
) {
	if (!(await $discord.canManageChannelsInCategory(category)))
		throw new Error("Cannot manage channels in event channel category");

	if (!readyRoom) {
		// Currently inherits permissions of category - this should be ok?
		readyRoom = await category.guild.channels.create({
			name: "Event Ready Room",
			type: ChannelType.GuildVoice,
			bitrate: 64000,
			videoQualityMode: VideoQualityMode.Auto,
			parent: category.id,
			reason: "Create event ready room for " + channel.name
		});
	}

	const eventChannel = await database.eventChannel.create({
		data: {
			discordGuildId: guild.id,
			discordId: channel.id,
			discordCategoryId: category.id,
			voiceChannels: {
				create: {
					discordId: readyRoom.id,
					readyRoom: true
				}
			}
		}
	});

	return eventChannel;
}

async function editEventChannel(channel: EventChannel, data: EventChannelEditInput) {
	return await database.eventChannel.update({
		where: { id: channel.id },
		data: {
			discordId: data.channelId ?? undefined,
			discordCategoryId: data.categoryId ?? undefined,
			readyRoomName: data.readyRoomName ?? undefined
		}
	});
}

async function deleteEventChannel(
	channel: EventChannel,
	discordClient: DiscordClient,
	deleteVoiceChannels = false
) {
	const events = await database.event.findMany({
		where: {
			channelId: channel.id,
			posted: true,
			endedAt: null,
			archived: false
		}
	});
	for (const event of events) {
		await unpostEvent(event, discordClient);
	}

	if (deleteVoiceChannels) {
		const vcs = await getEventChannelVoiceChannels(channel.id);
		for (const vc of vcs) {
			const discordChannel = await $discord.getChannel(
				discordClient,
				vc.discordId,
				channel.discordGuildId ?? undefined
			);
			if (discordChannel) {
				await discordChannel.delete("Deleting voice channels associated to event channel");
			}
		}
	}

	await database.eventChannel.delete({
		where: { id: channel.id }
	});
}

async function $init(context: Context) {
	const channels = await database.eventChannel.findMany();

	for (const channel of channels) {
		await updateEventChannelCalendarMessage(context.discordClient, channel, true);
	}
}

async function $update(context: Context) {
	// Update all expired events with an endedAt time
	const now = Date.now();
	const expiredEvents = await database.event.findMany({
		where: {
			posted: true,
			archived: false,
			endedAt: null,
			startAt: {
				lt: new Date(now - EVENT_EXPIRE_AFTER)
			}
		}
	});

	for (const event of expiredEvents) {
		if (!event.startAt || event.startAt.getTime() + (event.duration ?? 0) > now) continue;

		await expireEvent(event, context.discordClient);
	}
}

export const $events = {
	EVENT_EXPIRE_AFTER,
	$UPDATE_INTERVAL: 120 * 1000,
	$init,
	$update,
	getEvent,
	getEventFromMessageId,
	getEvents,
	getUpcomingEvents,
	getEndingEvents,
	getEventsInChannel,
	getEventEventChannel,
	getEventDiscordChannel,
	getEventThread,
	createEventThread,
	renameEventThread,
	archiveEventThreads,
	deleteEventThreads,
	getEventOwner,
	getEventSettings,
	getEventMember,
	getEventMembers,
	getEventRsvps,
	getEventMemberUser,
	getEventMemberEvent,
	getEventMemberRsvp,
	kickEventMember,
	getEventAccessRoles,
	getRSVPRoles,
	getRSVPMembers,
	getUserRsvp,
	setUserReminder,
	setEventReminder,
	createEvent,
	editEvent,
	postEvent,
	unpostEvent,
	endEvent,
	archiveEvent,
	deleteEvent,
	canSeeEvent,
	canJoinRsvp,
	rsvpForEvent,
	unrsvpForEvent,
	eventChannelExists,
	getAllEventChannels,
	getEventChannel,
	getEventChannelReadyRoom,
	getEventChannelVoiceChannels,
	createEventChannel,
	editEventChannel,
	deleteEventChannel
};
