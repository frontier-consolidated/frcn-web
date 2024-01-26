import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "@discordjs/builders";
import { dates, strings } from "@frcn/shared";
import { BaseMessageOptions, ButtonStyle } from "discord.js";

import { database } from "../../database";

export async function buildEventMessage(id: string) {
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

	const startAtSeconds = Math.floor(event.startAt.getTime() / 1000);
	const eventEmbed = new EmbedBuilder()
		.setColor(0x4ef2ff)
		.setTitle(`:calendar_spiral: ${event.name}`)
		.setDescription(event.description);

	if (!event.settings.hideLocation) {
		eventEmbed.addFields({
			name: "Location",
			value: event.location.map((loc) => `**${strings.toTitleCase(loc)}**`).join(" > "),
		});
	}

	eventEmbed
		.addFields(
			{
				name: "Time (Your Timezone)",
				value: `<t:${startAtSeconds}:F> (<t:${startAtSeconds}:R>)`,
			},
			{ name: "Duration", value: dates.toDuration(event.duration) },
			...event.roles.map((role) => ({
				name: `${
					role.emoji === role.emojiId
						? `:${role.emoji}:`
						: `<:${role.emoji}:${role.emojiId}>`
				} ${role.name} (0)`,
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
			.setEmoji({
				id: role.emoji === role.emojiId ? undefined : role.emojiId,
				name: role.emoji,
			})
			.setStyle(ButtonStyle.Secondary);

		buttonsRow.addComponents(button);
	}

	const weblinkButton = new ButtonBuilder()
		.setLabel("View")
		.setURL(`https://events.frcn.space/event/${event.id}`)
		.setStyle(ButtonStyle.Link);
	buttonsRow.addComponents(weblinkButton);

	return {
		embeds: [eventEmbed],
		components: [buttonsRow],
	} satisfies BaseMessageOptions;
}
