import { dates, strings } from "@frcn/shared";
import { getEmojiByName } from "@frcn/shared/emojis";
import { type AnyLocation, getLocations } from "@frcn/shared/locations";
import type { Event } from "@prisma/client";
import { type BaseMessageOptions, ButtonStyle, Client, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ThreadAutoArchiveDuration } from "discord.js";

import { database } from "../../database";
import { getWebOrigin } from "../../env";
import { $discord } from "../../services/discord";
import { $events } from "../../services/events";
import { PRIMARY_COLOR } from "../constants";

function getLocationEmoji(location: AnyLocation) {
	switch (location.type) {
		case "SYSTEM":
			return "<:System:1200467538841194506>"
		case "PLANET":
			return "<:Planet:1200467536358162553>"
		case "MOON":
			return "<:Moon:1200467530783920238>"
		case "STATION":
		case "COMM_ARRAY":
			return "<:Station:1200467537574506526>"
		case "LAGRANGE_POINT":
		case "JUMP_POINT":
			return "<:OrbitalMarker:1200467532805574717>"
		case "CITY":
			return "<:City:1200467529722761326>"
		case "OUTPOST":
			return "<:Outpost:1200467533975781507>"
		default:
			return ""
	}
}

export async function buildEventMessage(id: string, client: Client) {
	const guild = await $discord.getGuild(client)

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

	if (!event) throw new Error(`Could not create event message, since an event with id '${id}' could not be found`)

	const startAtSeconds = Math.floor(event.startAt!.getTime() / 1000);
	const eventEmbed = new EmbedBuilder()
		.setColor(PRIMARY_COLOR)
		.setTitle(`:calendar_spiral: ${event.name}`)
		.setDescription(event.description)
		.addFields({
			name: "Event Type",
			value: strings.toTitleCase(event.eventType!)
		})
	
	
	if (!event.settings!.hideLocation) {
		const locations = getLocations(event.location)

		eventEmbed.addFields({
			name: "Location",
			value: locations.map((loc) => `${getLocationEmoji(loc)} **${strings.toTitleCase(loc.name)}**`.trim()).join(" > "),
		});
	}

	event.roles.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

	eventEmbed
		.addFields(
			{
				name: "Time (Your Timezone)",
				value: `<t:${startAtSeconds}:F> (<t:${startAtSeconds}:R>)`,
			},
			{ name: "Duration", value: dates.toDuration(event.duration!) },
			...event.roles.map((role) => ({
				name: `${
					role.emoji === role.emojiId
						? `:${role.emoji}:`
						: `<:${role.emoji}:${role.emojiId}>`
				} ${role.name} (${role.members.length}${role.limit > 0 ? `/${role.limit}` : ""})`,
				value:
					role.members.length > 0
						? `> ${role.members.map((member) => member.user.discordName).join("\n")}`
						: " ",
				inline: true,
			}))
		)
		.setFooter({
			text: `Created by ${event.owner.discordName}`,
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
		
		const needsLabel = !!event.roles.find(r => r.emojiId === role.emojiId)
		if (needsLabel) {
			button.setLabel(role.name)
		}

		buttonsRow.addComponents(button);
	}

	const weblinkButton = new ButtonBuilder()
		.setLabel("View")
		.setURL(new URL(`/event/${event.id}`, getWebOrigin()).href)
		.setStyle(ButtonStyle.Link);
	buttonsRow.addComponents(weblinkButton);

	return {
		content: event.discordMentions.map(mention => mention === guild.roles.everyone.id ? "@everyone" : `<@&${mention}>`).join(" "),
		embeds: [eventEmbed],
		components: [buttonsRow],
	} satisfies BaseMessageOptions;
}

async function getEventMessage(client: Client, event: Event) {
	if (!event.discordEventMessageId) return null;
	const eventChannel = await database.event.getChannel(event);

	const channel = await $discord.getChannel(
		client,
		eventChannel.discordId
	);
	if (!channel?.isTextBased()) throw new Error("Could not find event channel, or channel is somehow not text based");
	return await channel.messages.fetch(event.discordEventMessageId);
}

export async function postEventMessage(client: Client, event: Event) {
	const eventChannel = await database.event.getChannel(event)

	const channel = await $discord.getChannel(client, eventChannel.discordId);
	if (!channel?.isTextBased()) throw new Error();

	const payload = await buildEventMessage(event.id, client);
	const eventMessage = await channel.send(payload);

	let createThread = !event.discordThreadId
	if (!createThread) {
		try {
			await $events.getEventThread(event, client)
		} catch (err) {
			createThread = true
		}
	}

	let threadId = event.discordThreadId
	if (createThread) {
		const thread = await eventMessage.startThread({
			name: event.name,
			reason: "Create thread for event: " + event.name,
			autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays
		})
		threadId = thread.id
	}

	await database.event.update({
		where: { id: event.id },
		data: {
			discordEventMessageId: eventMessage.id,
			discordThreadId: threadId,
			posted: true,
		},
	});
}

export async function updateEventMessage(client: Client, event: Event) {
	if (!event.posted) return;

	try {
		const message = await getEventMessage(client, event)
		if (!message) {
			// Message must have been deleted, repost it!
			await postEventMessage(client, event)
		} else {
			const payload = await buildEventMessage(event.id, client);
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
		const message = await getEventMessage(client, event)

		if (!message || !message.deletable) return;
		await message.delete()
	} catch (err) {
		console.error("Failed to delete event message");
		console.error(err);
	}
}