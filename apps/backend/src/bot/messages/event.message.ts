import { dates, strings } from "@frcn/shared";
import { getEmojiByName } from "@frcn/shared/emojis";
import { type AnyLocation, getLocations } from "@frcn/shared/locations";
import type { Event } from "@prisma/client";
import { type BaseMessageOptions, ButtonStyle, Client, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ThreadChannel } from "discord.js";

import { database } from "../../database";
import { getWebURL } from "../../env";
import { $discord } from "../../services/discord";
import { $events } from "../../services/events";
import { PRIMARY_COLOR } from "../constants";

function getLocationEmoji(location: AnyLocation) {
	switch (location.type) {
		case "SYSTEM":
			return "<:System:1200467538841194506>";
		case "PLANET":
			return "<:Planet:1200467536358162553>";
		case "MOON":
			return "<:Moon:1200467530783920238>";
		case "STATION":
		case "COMM_ARRAY":
			return "<:Station:1200467537574506526>";
		case "LAGRANGE_POINT":
		case "JUMP_POINT":
			return "<:OrbitalMarker:1200467532805574717>";
		case "CITY":
			return "<:City:1200467529722761326>";
		case "OUTPOST":
			return "<:Outpost:1200467533975781507>";
		default:
			return "";
	}
}

export async function buildEventMessage(id: string, client: Client, threadId?: string) {
	const guild = await $discord.getGuild(client);
	if (!guild) return null;

	const event = await database.event.findUnique({
		where: { id },
		include: {
			owner: {
				select: {
					discordName: true,
				},
			},
			roles: {
				include: {
					members: {
						include: {
							user: {
								select: {
									discordName: true,
								},
							},
						},
					},
				},
			},
			settings: {
				select: {
					hideLocation: true,
				},
			},
		},
	});

	if (!event) throw new Error(`Could not create event message, since an event with id '${id}' could not be found`);

	const startAtSeconds = Math.floor(event.startAt!.getTime() / 1000);
	const eventEmbed = new EmbedBuilder()
		.setColor(PRIMARY_COLOR)
		.setTitle(`:calendar_spiral: ${event.name}`)
		.setDescription(event.description ? event.description : "*No Description*")
		.addFields({
			name: "Event Type",
			value: strings.toTitleCase(event.eventType!)
		});
	
	
	if (!event.settings!.hideLocation) {
		let value = "";
		if (event.location.length > 0) {
			const locations = getLocations(event.location);
			value = locations.map((loc) => `${getLocationEmoji(loc)} **${strings.toTitleCase(loc.name)}**`.trim()).join(" > ");
		} else {
			value = "Anywhere";
		}

		eventEmbed.addFields({
			name: "Location",
			value
		});
	}

	event.roles.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
	
	eventEmbed
		.addFields(
			{
				name: "Time (Your Timezone)",
				value: `<t:${startAtSeconds}:F> (<t:${startAtSeconds}:R>)`,
			},
			{ name: "Duration", value: dates.toDuration(event.duration!) },
			{ name: "Thread", value: `<#${threadId ?? event.discordThreadId}>` },
			...event.roles.map((role) => {
				const members = role.members.filter(m => !!m.user);
				return {
					name: `${
						role.emoji === role.emojiId
							? `:${role.emoji}:`
							: `<:${role.emoji}:${role.emojiId}>`
					} ${role.name} (${members.length}${role.limit > 0 ? `/${role.limit}` : ""})`,
					value:
						members.length > 0
							? `>>> ${members.map((member) => member.user!.discordName).join("\n")}`
							: " ",
					inline: true,
				};
			})
		)
		.setFooter({
			text: `Created by ${event.owner?.discordName ?? "[DELETED USER]"}`,
		});

	if (event.imageUrl) eventEmbed.setImage(event.imageUrl);

	const buttonsRow = new ActionRowBuilder<ButtonBuilder>();
	for (const role of event.roles) {
		const button = new ButtonBuilder()
			.setCustomId(role.id)
			.setEmoji(role.emoji === role.emojiId ? getEmojiByName(role.emoji).surrogate : {
				id: role.emojiId,
				name: role.emoji,
			})
			.setStyle(ButtonStyle.Secondary);
		
		const needsLabel = !!event.roles.find(r => r.emojiId === role.emojiId);
		if (needsLabel) {
			button.setLabel(role.name);
		}

		buttonsRow.addComponents(button);
	}

	const weblinkButton = new ButtonBuilder()
		.setLabel("View")
		.setURL(getWebURL(`/event/${event.id}`).href)
		.setStyle(ButtonStyle.Link);
	buttonsRow.addComponents(weblinkButton);

	return {
		content: event.discordMentions.map(mention => mention === guild.roles.everyone.id ? "@everyone" : `<@&${mention}>`).join(" "),
		embeds: [eventEmbed],
		components: [buttonsRow],
	} satisfies BaseMessageOptions;
}

export async function getEventMessage(client: Client, event: Event) {
	if (!event.discordEventMessageId) return null;

	const channel = await $events.getEventDiscordChannel(event, client);
	return await channel.messages.fetch(event.discordEventMessageId);
}

export async function postEventMessage(client: Client, event: Event) {
	const channel = await $events.getEventDiscordChannel(event, client);

	let createThread = !event.discordThreadId;
	if (!createThread) {
		try {
			await $events.getEventThread(event, client);
		} catch (err) {
			createThread = true;
		}
	}

	let threadId = event.discordThreadId;
	let thread: ThreadChannel | null = null;
	if (createThread) {
		thread = await $events.createEventThread(event, client, channel);
		threadId = thread.id;
	}

	const payload = await buildEventMessage(event.id, client, threadId ?? undefined);
	if (!payload) throw new Error("Failed to build event message");
	const eventMessage = await channel.send(payload);
	
	if (createThread && thread) {
		const postLinkEmbed = new EmbedBuilder()
			.setColor(PRIMARY_COLOR)
			.setTitle(`:calendar_spiral: ${event.name}`)
			.setDescription(`This is the **${event.name}** event thread`);
		
		const postButton = new ButtonBuilder()
			.setLabel("See Details")
			.setURL(eventMessage.url)
			.setStyle(ButtonStyle.Link);
			
		const weblinkButton = new ButtonBuilder()
			.setLabel("View")
			.setURL(getWebURL(`/event/${event.id}`).href)
			.setStyle(ButtonStyle.Link);
			
		const buttonsRow = new ActionRowBuilder<ButtonBuilder>();
		buttonsRow.addComponents(postButton, weblinkButton);
		
		await thread.send({
			embeds: [postLinkEmbed],
			components: [buttonsRow]
		});
	}

	return {
		messageId: eventMessage.id,
		threadId
	};
}

export async function updateEventMessage(client: Client, event: Event) {
	if (!event.posted || event.endedAt) return;

	try {
		const message = await getEventMessage(client, event);
		if (!message) {
			// Message must have been deleted, repost it!
			await $events.postEvent(event, client);
		} else {
			const payload = await buildEventMessage(event.id, client);
			if (!payload) throw new Error("Failed to build event message");
			await message.edit(payload);
		}
	} catch (err) {
		console.error("Failed to update event message");
		console.error(err);
	}
}

export async function deleteEventMessage(client: Client, event: Event) {
	if (!event.posted) return;

	try {
		const message = await getEventMessage(client, event);

		if (!message || !message.deletable) return;
		await message.delete();
	} catch (err) {
		console.error("Failed to delete event message", err);
	}
}
