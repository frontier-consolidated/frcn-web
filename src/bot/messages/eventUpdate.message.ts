import { dates } from "@frcn/shared";
import type { Event } from "@prisma/client";
import { EmbedBuilder } from "discord.js";

import type { DiscordClient } from "..";
import { logger } from "../../logger";
import { $discord } from "../../services/discord";
import { $events } from "../../services/events";
import { PRIMARY_COLOR } from "../constants";
import { getLocationBreadcrumbs } from "../helpers";

async function addEventChangeFields(embed: EmbedBuilder, oldEvent: Event, newEvent: Event) {
	let hasChanges = false;

	if (oldEvent.startAt?.getTime() !== newEvent.startAt?.getTime()) {
		hasChanges = true;
		embed.addFields({
			name: "Start Time",
			value: `**Old:** ${
				oldEvent.startAt ? `<t:${Math.floor(oldEvent.startAt.getTime() / 1000)}:F>` : "null"
			}\n**New:** ${
				newEvent.startAt ? `<t:${Math.floor(newEvent.startAt.getTime() / 1000)}:F>` : "null"
			}`
		});
	}

	if (oldEvent.duration !== newEvent.duration) {
		hasChanges = true;
		embed.addFields({
			name: "Duration",
			value: `**Old:** ${
				oldEvent.duration ? dates.toDuration(oldEvent.duration) : "null"
			}\n**New:** ${newEvent.duration ? dates.toDuration(newEvent.duration) : "null"}`
		});
	}

	const settings = await $events.getEventSettings(newEvent.id);

	if (
		(!settings?.hideLocation || (newEvent.startAt && newEvent.startAt < new Date())) &&
		JSON.stringify(oldEvent.location) !== JSON.stringify(newEvent.location)
	) {
		hasChanges = true;
		embed.addFields({
			name: "Location",
			value: `**Old:** ${getLocationBreadcrumbs(
				oldEvent.location
			)}\n**New:** ${getLocationBreadcrumbs(newEvent.location)}`
		});
	}

	if (oldEvent.description !== newEvent.description) {
		hasChanges = true;

		const json = embed.toJSON();
		embed.setDescription(
			`${json.description ?? ""}\n### Description\n**Old:**\n${
				oldEvent.description.length > 1600
					? oldEvent.description.slice(0, 2000) + "..."
					: oldEvent.description
			}\n**New:**\n${newEvent.description}`
		);
	}

	return hasChanges;
}

export async function buildEventUpdateMessage(oldEvent: Event, newEvent: Event) {
	const embed = new EmbedBuilder()
		.setColor(PRIMARY_COLOR)
		.setTitle("Event Updated")
		.setDescription("Event details have changed, see changes below:");

	const hasChanges = await addEventChangeFields(embed, oldEvent, newEvent);

	return {
		hasChanges,
		embeds: [embed]
	};
}

export async function buildEventUpdateDmMessage(
	client: DiscordClient,
	oldEvent: Event,
	newEvent: Event
) {
	const guild = await $discord.getSystemGuild(client);
	const channel = newEvent.channelId ? await $events.getEventChannel(newEvent.channelId) : null;
	const eventMessageLink = `https://discord.com/channels/${
		channel?.discordGuildId ?? guild?.id
	}/${channel?.discordId}/${newEvent.discordEventMessageId}`;

	const embed = new EmbedBuilder()
		.setColor(PRIMARY_COLOR)
		.setTitle("Event Updated")
		.setDescription(
			`Details for the **[${newEvent.name}](${eventMessageLink})** have changed, see changes below:`
		);

	const hasChanges = await addEventChangeFields(embed, oldEvent, newEvent);

	return {
		hasChanges,
		embeds: [embed]
	};
}

export async function postEventUpdateMessage(
	client: DiscordClient,
	oldEvent: Event,
	newEvent: Event
) {
	if (!oldEvent.posted || !newEvent.posted) return;

	if (newEvent.discordThreadId) {
		try {
			const { hasChanges, embeds } = await buildEventUpdateMessage(oldEvent, newEvent);
			if (!hasChanges) return;
			const thread = await $events.getEventThread(client, newEvent);
			await thread.send({ embeds });
		} catch (err) {
			logger.error("Failed to post event update message", err);
		}
	} else {
		const { hasChanges, embeds } = await buildEventUpdateDmMessage(client, oldEvent, newEvent);
		if (!hasChanges) return;

		const eventUsers = await $events.getEventMembers(newEvent.id, {
			include: {
				user: {
					select: {
						discordId: true
					}
				}
			}
		});

		for (const rsvp of eventUsers) {
			if (!rsvp.user || !rsvp.rsvpId) continue;

			try {
				const discordUser = await client.users.fetch(rsvp.user.discordId);

				let dmChannel = discordUser.dmChannel;
				if (!dmChannel) {
					dmChannel = await discordUser.createDM();
				}
				await dmChannel.send({ embeds });
			} catch (err) {
				// failed to dm
				logger.error("Failed to dm user", rsvp.userId, err);
			}
		}
	}
}
