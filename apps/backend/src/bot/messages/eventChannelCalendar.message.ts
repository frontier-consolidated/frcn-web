import type { Event, EventChannel } from "@prisma/client";
import { type BaseMessageOptions, EmbedBuilder, TextChannel } from "discord.js";

import type { DiscordClient } from "..";
import { database } from "../../database";
import { logger } from "../../logger";
import { $discord } from "../../services/discord";
import { PRIMARY_COLOR } from "../constants";

export async function buildEventChannelCalendarMessage(id: number, client: DiscordClient) {
	const channel = await database.eventChannel.findUnique({
		where: { id },
		include: {
			events: {
				where: {
					posted: true,
					archived: false,
					expired: false,
					endedAt: null,
					startAt: {
						not: null
					}
				},
				orderBy: {
					startAt: "asc"
				}
			}
		}
	});
	if (!channel)
		throw new Error(
			`Could not create event channel message, since an event channel with id '${id}' could not be found`
		);

	const guild = channel.discordGuildId
		? await $discord.getGuild(client, channel.discordGuildId)
		: await $discord.getSystemGuild(client);
	if (!guild) return null;

	const calendarEmbed = new EmbedBuilder()
		.setColor(PRIMARY_COLOR)
		.setTitle(":page_with_curl: Upcoming Events")
		.setDescription(
			"Times are shown in your timezone" +
				(channel.events.length === 0 ? "\n\n*No scheduled events*" : "")
		)
		.setFooter({
			text: "Only events posted in this channel will be listed"
		});

	const now = new Date();

	const started: Event[] = [];
	const next24Hours: Event[] = [];
	const next7Days: Event[] = [];
	const byMonth: Record<string, Event[]> = {};

	for (const event of channel.events) {
		if (!event.startAt) continue;

		if (event.startAt.getTime() <= now.getTime()) {
			started.push(event);
		} else if (event.startAt.getTime() < now.getTime() + 24 * 60 * 60 * 1000) {
			next24Hours.push(event);
		} else if (event.startAt.getTime() < now.getTime() + 7 * 24 * 60 * 60 * 1000) {
			next7Days.push(event);
		} else {
			const monthString = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" })
				.format(event.startAt)
				.replace(new RegExp(`\\s*${now.getFullYear()}`), "");
			if (!byMonth[monthString]) {
				byMonth[monthString] = [];
			}

			byMonth[monthString].push(event);
		}
	}

	const channelLink = `https://discord.com/channels/${channel.discordGuildId ?? guild.id}/${
		channel.discordId
	}/`;

	if (started.length > 0) {
		calendarEmbed.addFields({
			name: ":green_circle: Started",
			value: `>>> ${started
				.map((event) => {
					const startTime = Math.round(event.startAt!.getTime() / 1000);
					return `<t:${startTime}:t> **[${event.name}](${
						channelLink + event.discordEventMessageId
					})** <t:${startTime}:R>`;
				})
				.join("\n")}`
		});
	}

	if (next24Hours.length > 0) {
		calendarEmbed.addFields({
			name: "Next 24 hours",
			value: `>>> ${next24Hours
				.map((event) => {
					const startTime = Math.round(event.startAt!.getTime() / 1000);
					return `<t:${startTime}:t> **[${event.name}](${
						channelLink + event.discordEventMessageId
					})** <t:${startTime}:R>`;
				})
				.join("\n")}`
		});
	}

	if (next7Days.length > 0) {
		calendarEmbed.addFields({
			name: "Next 7 days",
			value: `>>> ${next7Days
				.map((event) => {
					const startTime = Math.round(event.startAt!.getTime() / 1000);
					return `<t:${startTime}:F> **[${event.name}](${
						channelLink + event.discordEventMessageId
					})** <t:${startTime}:R>`;
				})
				.join("\n")}`
		});
	}

	for (const [month, events] of Object.entries(byMonth)) {
		calendarEmbed.addFields({
			name: month,
			value: `>>> ${events
				.map((event) => {
					const startTime = Math.round(event.startAt!.getTime() / 1000);
					return `<t:${startTime}:F> **[${event.name}](${
						channelLink + event.discordEventMessageId
					})** <t:${startTime}:R>`;
				})
				.join("\n")}`
		});
	}

	return {
		embeds: [calendarEmbed]
	} satisfies BaseMessageOptions;
}

async function getDiscordChannel(client: DiscordClient, channel: EventChannel) {
	const discordChannel = await $discord.getChannel(
		client,
		channel.discordId,
		channel.discordGuildId ?? undefined
	);
	if (!discordChannel?.isTextBased() || !(discordChannel instanceof TextChannel))
		throw new Error("Could not find event channel, or channel is somehow not text based");

	return discordChannel;
}

async function getEventChannelCalendarMessage(client: DiscordClient, channel: EventChannel) {
	try {
		const discordChannel = await getDiscordChannel(client, channel);
		return channel.discordCalendarMessageId
			? await discordChannel.messages.fetch(channel.discordCalendarMessageId)
			: null;
	} catch (err) {
		return null;
	}
}

export async function updateEventChannelCalendarMessage(
	client: DiscordClient,
	channel: EventChannel,
	repost = false
) {
	try {
		const payload = await buildEventChannelCalendarMessage(channel.id, client);
		if (!payload) throw new Error("Failed to build event message");

		const discordChannel = await getDiscordChannel(client, channel);
		let message = await getEventChannelCalendarMessage(client, channel);

		if (repost || (message && discordChannel.lastMessageId !== message.id)) {
			if (message) await message.delete();
			message = null;
		}

		if (!message) {
			message = await discordChannel.send(payload);

			await database.eventChannel.update({
				where: { id: channel.id },
				data: {
					discordCalendarMessageId: message.id
				}
			});
		} else {
			await message.edit(payload);
		}
	} catch (err) {
		logger.error("Failed to update event channel calendar message", { channel: channel.id }, err);
	}
}
