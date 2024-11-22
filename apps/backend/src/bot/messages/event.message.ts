import { dates, strings } from "@frcn/shared";
import { getEmojiByName } from "@frcn/shared/emojis";
import type { Event } from "@prisma/client";
import {
	type BaseMessageOptions,
	ButtonStyle,
	ActionRowBuilder,
	ButtonBuilder,
	EmbedBuilder,
	ThreadChannel,
	escapeMarkdown,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder
} from "discord.js";

import type { DiscordClient } from "..";
import { database } from "../../database";
import { getWebURL } from "../../env";
import { logger } from "../../logger";
import { $discord } from "../../services/discord";
import { $events } from "../../services/events";
import { PRIMARY_COLOR } from "../constants";
import { getLocationBreadcrumbs } from "../helpers";

export async function buildEventMessage(id: string, client: DiscordClient, threadId?: string) {
	const event = await database.event.findUnique({
		where: { id },
		include: {
			channel: {
				select: {
					discordGuildId: true
				}
			},
			owner: {
				select: {
					discordName: true
				}
			},
			roles: {
				include: {
					members: {
						include: {
							user: {
								select: {
									discordName: true
								}
							}
						},
						orderBy: {
							createdAt: "asc"
						}
					}
				}
			},
			settings: {
				select: {
					hideLocation: true
				}
			}
		}
	});
	if (!event)
		throw new Error(
			`Could not create event message, since an event with id '${id}' could not be found`
		);

	const guild = event.channel?.discordGuildId
		? await $discord.getGuild(client, event.channel.discordGuildId)
		: await $discord.getSystemGuild(client);
	if (!guild) return null;

	const title = `:calendar_spiral: ${event.name}`;
	const description = event.description ? event.description : "*No Description*";

	const startAtSeconds = Math.floor(event.startAt!.getTime() / 1000);
	const eventEmbed = new EmbedBuilder()
		.setColor(PRIMARY_COLOR)
		.setTitle(title)
		.setDescription(description)
		.addFields({
			name: "Event Type",
			value: strings.toTitleCase(event.eventType!),
			inline: true
		});

	if (!event.settings!.hideLocation) {
		eventEmbed.addFields({
			name: "Location",
			value: getLocationBreadcrumbs(event.location),
			inline: true
		});
	}

	event.roles.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

	const totalMembers = event.roles.reduce(
		(total, role) => total + role.members.filter((m) => !!m.user).length,
		0
	);
	// This will go negative eventually if the event has a lot of RSVP roles, but let's just hope that never happens :)
	const remainingCharacterLimit =
		5500 - title.length - description.length - 120 * event.roles.length;

	threadId ??= event.discordThreadId ?? undefined;
	eventEmbed
		.addFields(
			{ name: "Duration", value: dates.toDuration(event.duration!), inline: true },
			...(threadId ? [{ name: "Thread", value: `<#${threadId}>`, inline: true }] : []),
			{
				name: "Time (Your Timezone)",
				value: `<t:${startAtSeconds}:F> (<t:${startAtSeconds}:R>)`
			},
			...event.roles.map((role) => {
				const members = role.members.filter((m) => !!m.user);
				const roleEmoji =
					role.emoji === role.emojiId
						? `:${role.emoji}:`
						: `<:${role.emoji}:${role.emojiId}>`;

				const valueLimit =
					120 +
					Math.min(
						880,
						Math.floor((members.length / totalMembers) * remainingCharacterLimit)
					);
				let value = " ";
				if (members.length > 0) {
					for (const [i, member] of members.entries()) {
						const prefix = i === 0 ? ">>> " : "\n";
						const memberName = escapeMarkdown(member.user!.discordName);

						if (value.length + memberName.length > valueLimit) {
							value += `${prefix}**+${members.length - i} more**`;
							break;
						}

						value += `${prefix}${memberName}`;
					}
				}

				return {
					name: `${roleEmoji} ${escapeMarkdown(role.name)} (${members.length}${
						role.limit > 0 ? `/${role.limit}` : ""
					})`,
					value,
					inline: true
				};
			})
		)
		.setFooter({
			text: `Created by ${event.owner?.discordName ?? "[DELETED USER]"}`
		});

	if (event.imageUrl) eventEmbed.setImage(event.imageUrl);

	const rsvpSelect = new StringSelectMenuBuilder()
		.setCustomId("select-rsvp")
		.setPlaceholder("Select RSVP");

	for (const role of event.roles) {
		const option = new StringSelectMenuOptionBuilder()
			.setLabel(role.name)
			.setValue(role.id)
			.setEmoji(
				role.emoji === role.emojiId
					? getEmojiByName(role.emoji).surrogate
					: {
							id: role.emojiId,
							name: role.emoji
					  }
			);

		rsvpSelect.addOptions(option);
	}

	const unrsvpButton = new ButtonBuilder()
		.setCustomId("unrsvp")
		.setLabel("UnRSVP")
		.setStyle(ButtonStyle.Danger);

	const weblinkButton = new ButtonBuilder()
		.setLabel("View")
		.setURL(getWebURL(`/event/${event.id}`).href)
		.setStyle(ButtonStyle.Link);

	const selectRow = new ActionRowBuilder<StringSelectMenuBuilder>();
	selectRow.addComponents(rsvpSelect);

	const buttonRow = new ActionRowBuilder<ButtonBuilder>();
	buttonRow.addComponents(unrsvpButton, weblinkButton);

	return {
		content: event.discordMentions
			.map((mention) =>
				mention === guild.roles.everyone.id ? "@everyone" : `<@&${mention}>`
			)
			.join(" "),
		embeds: [eventEmbed],
		components: [selectRow, buttonRow]
	} satisfies BaseMessageOptions;
}

export async function getEventMessage(client: DiscordClient, event: Event) {
	if (!event.discordEventMessageId) return null;

	try {
		const channel = await $events.getEventDiscordChannel(event, client);
		return await channel.messages.fetch(event.discordEventMessageId);
	} catch (err) {
		return null;
	}
}

export async function postEventMessage(client: DiscordClient, event: Event) {
	const channel = await $events.getEventDiscordChannel(event, client);
	const settings = await $events.getEventSettings(event.id);

	let createThread = !event.discordThreadId && settings?.createEventThread;
	if (!createThread && settings?.createEventThread) {
		try {
			await $events.getEventThread(client, event);
		} catch (err) {
			createThread = true;
		}
	}

	let threadId = event.discordThreadId;
	let thread: ThreadChannel | null = null;
	if (createThread) {
		thread = await $events.createEventThread(event, client, channel);
		threadId = thread?.id ?? null;
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

export async function updateEventMessage(client: DiscordClient, event: Event) {
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
		logger.error("Failed to update event message", err);
	}
}

export async function deleteEventMessage(client: DiscordClient, event: Event) {
	if (!event.posted) return;

	try {
		const message = await getEventMessage(client, event);

		if (!message || !message.deletable) return;
		await message.delete();
	} catch (err) {
		logger.error("Failed to delete event message", err);
	}
}
