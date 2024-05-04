import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

import { logger } from "../../logger";
import { $discord } from "../../services/discord";
import { buildErrorMessage } from "../messages/error.message";
import { buildSuccessMessage } from "../messages/success.message";

export const command = new SlashCommandBuilder()
    .setName("clearrole")
    .setDescription("Clear all users from the role (this command may to a while to execute)")
    .addRoleOption(opt => 
        opt.setName("role")
            .setDescription("The role to remove all users from")
            .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setDMPermission(false);

export async function execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inGuild() || !interaction.guild) {
        return await interaction.reply({
            ...buildErrorMessage("Command must be used in a guild"),
            ephemeral: true
        });
    }

    const role = interaction.options.getRole("role", true);
    
    const me = interaction.guild.members.me ?? await interaction.guild.members.fetchMe();
    if (!me.permissions.has(PermissionFlagsBits.ManageRoles)) {
        return await interaction.reply({
            ...buildErrorMessage(`<@${me.user.id}> is missing permission to add/remove roles`),
            ephemeral: true
        });
    }

    const highestAllowedRole = me.roles.highest;

    if (role.position >= highestAllowedRole.position) {
        return await interaction.reply({
            ...buildErrorMessage("Selected role is too high"),
            ephemeral: true
        });
    }

    await interaction.deferReply({
        ephemeral: true
    });

    let total = 0;
    let removed = 0;
    try {
        const members = await $discord.getAllMembers(interaction.client, interaction.guild.id);
        const membersOfRole = members.filter(member => member.roles.cache.has(role.id));
        total = membersOfRole.length;

        for (const member of membersOfRole.values()) {
            console.log("Removing Community role for", member.user.tag);
            await member.roles.remove(
                role.id,
                `Clearing role via /clearrole command, ran by <@${interaction.user.id}>`
            );
            removed += 1;
        }
        await interaction.reply({
            ...buildSuccessMessage(`Successfully removed <@&${role.id}> from ${removed} member(s)`),
            ephemeral: true
        });
    } catch (err) {
        logger.error("Running `/clearrole` command, failed to clear role", role, err);
        return await interaction.reply({
            ...buildErrorMessage(`Failed while removing <@&${role.id}> from members: removed from ${removed} member(s), ${total - removed} remaining`),
            ephemeral: true
        });
    }
}