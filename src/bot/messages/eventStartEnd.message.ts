import { dates } from "@frcn/shared";
import type { Event } from "@prisma/client";
import {
	type BaseMessageOptions,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle
} from "discord.js";

import type { DiscordClient } from "..";
import { $discord } from "../../services/discord";
import { $events } from "../../services/events";
import { PRIMARY_COLOR } from "../constants";
import { getLocationBreadcrumbs } from "../helpers";

export async function buildEventStartMessage(
	client: DiscordClient,
	event: Event,
	eventMessageLink: string
) {
	const scheduledEndTime = Math.floor((event.startAt!.getTime() + event.duration!) / 1000);

	const embed = new EmbedBuilder()
		.setColor(PRIMARY_COLOR)
		.setTitle(`${event.name} - Event starting!`)
		.setDescription(
			`The event is now starting! Scheduled event end: <t:${scheduledEndTime}:R>`
		);

	if (event.location) {
		embed.addFields({
			name: "Location",
			value: getLocationBreadcrumbs(event.location)
		});
	}

	let vcLink = "";
	if (event.channelId) {
		const readyRoom = await $events.getEventChannelReadyRoom(event.channelId);
		const readyRoomChannel =
			readyRoom &&
			(await $discord.getChannel(
				client,
				readyRoom.discordId,
				readyRoom.channel.discordGuildId ?? undefined
			));

		if (readyRoomChannel) vcLink = readyRoomChannel.url;
	}

	const messageButton = new ButtonBuilder()
		.setLabel("See Details")
		.setURL(eventMessageLink)
		.setStyle(ButtonStyle.Link);

	const buttonsRow = new ActionRowBuilder<ButtonBuilder>();
	buttonsRow.addComponents(messageButton);

	return {
		content: `@everyone ${vcLink}`,
		embeds: [embed],
		components: [buttonsRow]
	} satisfies BaseMessageOptions;
}

export async function buildEventStartSoonMessage(client: DiscordClient, event: Event) {
	const scheduledStartTime = Math.floor(event.startAt!.getTime() / 1000);

	const embed = new EmbedBuilder()
		.setColor(PRIMARY_COLOR)
		.setTitle(`${event.name} - Event starting soon!`)
		.setDescription(`The event is starting soon! Starting <t:${scheduledStartTime}:R>`);

	let vcLink = "";
	if (event.channelId) {
		const readyRoom = await $events.getEventChannelReadyRoom(event.channelId);
		const readyRoomChannel =
			readyRoom &&
			(await $discord.getChannel(
				client,
				readyRoom.discordId,
				readyRoom.channel.discordGuildId ?? undefined
			));

		if (readyRoomChannel) vcLink = readyRoomChannel.url;
	}

	return {
		content: `${vcLink}`,
		embeds: [embed]
	} satisfies BaseMessageOptions;
}

export function buildEventScheduledEndMessage(event: Event) {
	const embed = new EmbedBuilder()
		.setColor(PRIMARY_COLOR)
		.setTitle(`${event.name} - Scheduled end`)
		.setDescription("Reached the scheduled end of the event");

	const endButton = new ButtonBuilder()
		.setCustomId(`end-event-${event.id}`)
		.setLabel("End Event")
		.setStyle(ButtonStyle.Danger)
		.setDisabled(!!event.endedAt);

	const buttonsRow = new ActionRowBuilder<ButtonBuilder>();
	buttonsRow.addComponents(endButton);

	return {
		embeds: [embed],
		components: [buttonsRow]
	} satisfies BaseMessageOptions;
}

export function buildEventEndedMessage(event: Event) {
	const embed = new EmbedBuilder()
		.setColor(PRIMARY_COLOR)
		.setTitle(`${event.name} - Event ended`)
		.addFields({
			name: "Total Duration",
			value: dates.toDuration(event.endedAt!.getTime() - event.startAt!.getTime())
		});

	const archiveButton = new ButtonBuilder()
		.setCustomId(`archive-event-${event.id}`)
		.setEmoji("🗃️")
		.setLabel("Archive Event")
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(event.archived);

	const buttonsRow = new ActionRowBuilder<ButtonBuilder>();
	buttonsRow.addComponents(archiveButton);

	return {
		embeds: [embed],
		components: [buttonsRow]
	} satisfies BaseMessageOptions;
}

export async function postEventEndMessage(client: DiscordClient, event: Event) {
	if (!event.posted || !event.discordThreadId) return;

	const thread = await $events.getEventThread(client, event);

	const payload = buildEventEndedMessage(event);
	if (!payload) throw new Error("Failed to build event end message");
	await thread.send(payload);
}
