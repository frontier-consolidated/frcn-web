import { Permission, hasOwnedObjectPermission } from "@frcn/shared";
import type { AnySelectMenuInteraction, ButtonInteraction } from "discord.js";

import { logger } from "../../logger";
import { $discord } from "../../services/discord";
import { $events } from "../../services/events";
import { $users } from "../../services/users";
import { buildErrorMessage } from "../messages/error.message";
import { buildEventScheduledEndMessage } from "../messages/eventStartEnd.message";
import {
	buildRsvpDmMessage,
	buildRsvpMessage,
	buildRsvpSwitchMessage
} from "../messages/rsvp.message";
import { buildUnrsvpMessage } from "../messages/unrsvp.message";

async function handleEndEvent(interaction: ButtonInteraction | AnySelectMenuInteraction) {
	const eventId = interaction.customId.substring(10);

	const event = await $events.getEvent(eventId);
	if (!event) {
		await interaction.reply({
			...buildErrorMessage("Action failed! Could not find event in database"),
			ephemeral: true
		});
		return;
	}

	if (event.endedAt) {
		await interaction.reply({
			...buildErrorMessage("Event has already been ended"),
			ephemeral: true
		});
		return;
	}

	const user = await $users.getOrCreateUser(
		$discord.convertDJSUserToAPIUser(interaction.user),
		interaction.client
	);

	const permissions = await $users.getPermissions(user);
	if (
		!hasOwnedObjectPermission({
			user: { id: user.id, permissions },
			owner: event.ownerId ? { id: event.ownerId } : null,
			required: Permission.CreateEvents,
			override: Permission.ManageEvents
		})
	) {
		await interaction.reply({
			...buildErrorMessage("You do not have permission to end this event"),
			ephemeral: true
		});
		return;
	}

	const endedEvent = await $events.endEvent(event, interaction.client);

	const payload = buildEventScheduledEndMessage(endedEvent);
	await interaction.message.edit({
		...payload
	});

	await interaction.deferUpdate();
}

async function handleArchiveEvent(interaction: ButtonInteraction | AnySelectMenuInteraction) {
	const eventId = interaction.customId.substring(14);

	const event = await $events.getEvent(eventId);
	if (!event) {
		await interaction.reply({
			...buildErrorMessage("Action failed! Could not find event in database"),
			ephemeral: true
		});
		return;
	}

	if (event.archived) {
		await interaction.reply({
			...buildErrorMessage("Event has already been archived"),
			ephemeral: true
		});
		return;
	}

	const user = await $users.getOrCreateUser(
		$discord.convertDJSUserToAPIUser(interaction.user),
		interaction.client
	);

	const permissions = await $users.getPermissions(user);
	if (
		!hasOwnedObjectPermission({
			user: { id: user.id, permissions },
			owner: event.ownerId ? { id: event.ownerId } : null,
			required: Permission.CreateEvents,
			override: Permission.ManageEvents
		})
	) {
		await interaction.reply({
			...buildErrorMessage("You do not have permission to archive this event"),
			ephemeral: true
		});
		return;
	}

	await $events.archiveEvent(event, interaction.client);
	await interaction.deferUpdate();
}

async function handleEventRsvp(interaction: ButtonInteraction | AnySelectMenuInteraction) {
	const event = await $events.getEventFromMessageId(interaction.message.id);
	if (!event) {
		await interaction.editReply({
			...buildErrorMessage("Action failed! Could not find event in database")
		});
		return;
	}

	if (event.endedAt) {
		await interaction.editReply({
			...buildErrorMessage("Cannot rsvp/unrsvp to event after it has ended")
		});
		return;
	}

	const user = await $users.getOrCreateUser(
		$discord.convertDJSUserToAPIUser(interaction.user),
		interaction.client
	);
	const currentRsvp = await $events.getUserRsvp(event, user);

	if (interaction.customId === "unrsvp") {
		await $events.unrsvpForEvent(event, user, interaction.client);

		const payload = buildUnrsvpMessage();
		await interaction.editReply({
			...payload
		});

		return;
	}

	if (interaction.customId !== "select-rsvp" || !interaction.isStringSelectMenu()) {
		await interaction.editReply({
			...buildErrorMessage("Action failed! Unknown event interaction")
		});
		return;
	}

	const roleId = interaction.values[0];

	const roles = await $events.getRSVPRoles(event.id);
	const role = roles.find((r) => r.id === roleId);
	if (!role) {
		await interaction.editReply({
			...buildErrorMessage("Action failed! Could not find rsvp role in event")
		});
		return;
	}

	if (!(await $events.canJoinRsvp(role))) {
		await interaction.editReply({
			...buildErrorMessage(
				`RSVP __${role.emoji === role.emojiId ? `:${role.emoji}:` : `<:${role.emoji}:${role.emojiId}>`} ${role.name}__ is full`
			)
		});
	} else {
		await $events.rsvpForEvent(event, role, user, currentRsvp, interaction.client);

		let dmMessageLink: string | null = null;
		if (!currentRsvp || !currentRsvp.rsvpId) {
			try {
				const dmPayload = buildRsvpDmMessage(event, role, interaction.message.url);

				let dmChannel = interaction.user.dmChannel;
				if (!dmChannel) {
					dmChannel = await interaction.user.createDM();
				}
				const dmMessage = await dmChannel.send(dmPayload);

				dmMessageLink = dmMessage.url;
			} catch (err) {
				// failed to dm
				logger.error("Failed to dm user", interaction.user.username, err);
			}
		}

		const threadUrl = event.discordThreadId
			? `https://discord.com/channels/${interaction.guildId}/${event.discordThreadId}`
			: undefined;

		const payload =
			currentRsvp && currentRsvp.rsvpId
				? buildRsvpSwitchMessage(role)
				: buildRsvpMessage(role, dmMessageLink, threadUrl);

		await interaction.editReply({
			...payload
		});
	}
}

export async function eventInteraction(interaction: ButtonInteraction | AnySelectMenuInteraction) {
	if (interaction.customId.startsWith("end-event-")) {
		await handleEndEvent(interaction);
	} else if (interaction.customId.startsWith("archive-event-")) {
		await handleArchiveEvent(interaction);
	} else if (interaction.customId === "unrsvp" || interaction.customId === "select-rsvp") {
		await interaction.deferReply({
			ephemeral: true
		});
		await handleEventRsvp(interaction);
	}
}
