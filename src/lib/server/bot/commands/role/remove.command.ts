import {
	defineSubcommand,
	getGuildMember,
	iHaveDiscordPermissions
} from "@l3dev/discord.js-helpers";
import { logger } from "@l3dev/logger";
import { NONE, Result } from "@l3dev/result";
import { MessageFlags } from "discord.js";

import { errorMessage } from "$server/bot/messages/error.message";

export default defineSubcommand({
	name: "remove",
	define(builder) {
		return builder
			.setName(this.name)
			.setDescription("Remove a role from a user")
			.addRoleOption((opt) =>
				opt.setName("role").setDescription("The role to take from the user").setRequired(true)
			)
			.addUserOption((opt) =>
				opt.setName("user").setDescription("The user to remove the role from").setRequired(true)
			);
	},
	async execute(interaction) {
		if (!interaction.inGuild() || !interaction.guild) {
			return NONE;
		}

		const role = interaction.options.getRole("role", true);
		const user = interaction.options.getUser("user", true);

		const memberResult = await getGuildMember(interaction.guild, user.id);
		if (!memberResult.ok) {
			logger.error(memberResult);
			const errorMessageResult = await Result.fromPromise(
				{ onError: { type: "GET_MEMBER_ERROR_MESSAGE" } },
				interaction.reply({
					...errorMessage.build(`Error while getting the guild member <@${user.id}>`).value,
					flags: MessageFlags.Ephemeral
				})
			);
			return errorMessageResult;
		}

		const member = memberResult.value;

		const havePermissionsResult = await iHaveDiscordPermissions(["ManageRoles"], {
			guild: interaction.guild
		});
		if (!havePermissionsResult.ok) {
			if (havePermissionsResult.type === "MISSING_PERMISSIONS") {
				const missingPermissions = havePermissionsResult.context.missingPermissions
					.map((p) => `\`${p}\``)
					.join(", ");
				return await Result.fromPromise(
					{ onError: { type: "MISSING_PERMISSIONS_MESSAGE" } },
					interaction.reply({
						...errorMessage.build(`Bot missing permissions: ${missingPermissions}`).value,
						flags: MessageFlags.Ephemeral
					})
				);
			}
			return await Result.fromPromise(
				{ onError: { type: "PERMISSIONS_ERROR_MESSAGE" } },
				interaction.reply({
					...errorMessage.build("Failed to check permissions").value,
					flags: MessageFlags.Ephemeral
				})
			);
		}

		const highestAllowedRole = interaction.guild.members.me!.roles.highest;
		if (role.position >= highestAllowedRole.position) {
			return await Result.fromPromise(
				{ onError: { type: "ROLE_TOO_HIGH_ERROR_MESSAGE" } },
				interaction.reply({
					...errorMessage.build("Role must be lower than the bot's highest role").value,
					flags: MessageFlags.Ephemeral
				})
			);
		}

		const removeRoleResult = await Result.fromPromise(
			{ onError: { type: "REMOVE_ROLE_FROM_MEMBER", context: { role, member } } },
			member.roles.remove(role.id)
		);

		if (!removeRoleResult.ok) {
			logger.error(removeRoleResult);
			const errorMessageResult = await Result.fromPromise(
				{ onError: { type: "REMOVE_ROLE_ERROR_MESSAGE" } },
				interaction.reply({
					...errorMessage.build(`Failed to remove <@&${role.id}> from <@${user.id}>`).value,
					flags: MessageFlags.Ephemeral
				})
			);

			return errorMessageResult;
		}

		return await Result.fromPromise(
			{ onError: { type: "REMOVE_ROLE_MESSAGE" } },
			interaction.reply({
				content: `:white_check_mark: Removed <@&${role.id}> from <@${user.id}>`,
				flags: MessageFlags.Ephemeral
			})
		);
	}
});
