import { dates } from "@frcn/shared";
import type { Event } from "@prisma/client";
import { EmbedBuilder, Client } from "discord.js";

import { $events } from "../../services/events";
import { PRIMARY_COLOR } from "../constants";
import { getLocationBreadcrumbs } from "../helpers";

export async function buildEventUpdateMessage(client: Client, oldEvent: Event, newEvent: Event) {
	const embed = new EmbedBuilder()
		.setColor(PRIMARY_COLOR)
		.setTitle("Event Updated")
		.setDescription("Event details have changed, see changes below:");

	let hasChanges = false;
	
	if (oldEvent.startAt?.getTime() !== newEvent.startAt?.getTime()) {
		hasChanges = true;
		embed.addFields({
			name: "Start Time",
			value: `**Old:** ${oldEvent.startAt ? `<t:${Math.floor(oldEvent.startAt.getTime() / 1000)}:F>` : "null"}\n**New:** ${newEvent.startAt ? `<t:${Math.floor(newEvent.startAt.getTime() / 1000)}:F>` : "null"}`
		});
	}

	if (oldEvent.duration !== newEvent.duration) {
		hasChanges = true;
		embed.addFields({
			name: "Start Time",
			value: `**Old:** ${oldEvent.duration ? dates.toDuration(oldEvent.duration) : "null"}\n**New:** ${newEvent.duration ? dates.toDuration(newEvent.duration) : "null"}`
		});
	}

	const settings = await $events.getEventSettings(newEvent.id);

	if ((!settings?.hideLocation || (newEvent.startAt && newEvent.startAt < new Date())) && JSON.stringify(oldEvent.location) !== JSON.stringify(newEvent.location)) {
		hasChanges = true;
		embed.addFields({
			name: "Location",
			value: `**Old:** ${getLocationBreadcrumbs(oldEvent.location)}\n**New:** ${getLocationBreadcrumbs(newEvent.location)}`
		});
	}
	
	return {
		hasChanges,
		embeds: [embed],
	};
}

export async function postEventUpdateMessage(client: Client, oldEvent: Event, newEvent: Event) {
	if (!oldEvent.posted || !newEvent.posted) return;

	try {
		const { hasChanges, embeds } = await buildEventUpdateMessage(client, oldEvent, newEvent);
		if (!hasChanges) return;
		const thread = await $events.getEventThread(newEvent, client);
		await thread.send({ embeds });
	} catch (err) {
		console.error("Failed to post event update message", err);
	}
}