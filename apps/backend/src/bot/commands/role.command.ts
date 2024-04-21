import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

import { logger } from "../../logger";
import { buildErrorMessage } from "../messages/error.message";
import { buildSuccessMessage } from "../messages/success.message";

export const command = new SlashCommandBuilder()
    .setName("role")
    .setDescription("Add or remove a role from a user")
    .addSubcommand(sub => 
        sub.setName("add")
            .setDescription("Add a role to a user")
            .addRoleOption(opt => 
                opt.setName("role")
                    .setDescription("The role to give the user")
                    .setRequired(true)
            )
            .addUserOption(opt =>
                opt.setName("user")
                    .setDescription("The user to give the role to")
                    .setRequired(true)
            )
    )
    .addSubcommand(sub =>
        sub.setName("remove")
            .setDescription("Remove a role from a user")
            .addRoleOption(opt => 
                opt.setName("role")
                    .setDescription("The role to take from the user")
                    .setRequired(true)
            )
            .addUserOption(opt => 
                opt.setName("user")
                    .setDescription("The user to remove the role from")
                    .setRequired(true)
            )
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

    const action = interaction.options.getSubcommand(true);
    const role = interaction.options.getRole("role", true);
    const user = interaction.options.getUser("user", true);

    let member;
    try {
        member = interaction.guild.members.cache.get(user.id) ?? await interaction.guild.members.fetch(user);
    } catch (err) {
        return await interaction.reply({
            ...buildErrorMessage("Failed to find user"),
            ephemeral: true
        });
    }
    
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

    switch (action) {
        case "add":
            try {
                await member.roles.add(role.id);
                await interaction.reply({
                    ...buildSuccessMessage(`Added <@&${role.id}> to <@${user.id}>`),
                    ephemeral: true
                });
            } catch (err) {
                logger.error("Running `/role add` command, failed to add role to user", { role, member }, err);
                return await interaction.reply({
                    ...buildErrorMessage(`Failed to add <@&${role.id}> to <@${user.id}>`),
                    ephemeral: true
                });
            }
            break;
        case "remove":
            try {
                await member.roles.remove(role.id);
                await interaction.reply({
                    ...buildSuccessMessage(`Removed <@&${role.id}> from <@${user.id}>`),
                    ephemeral: true
                });
            } catch (err) {
                logger.error("Running `/role remove` command, failed to remove role from user", { role, member }, err);
                return await interaction.reply({
                    ...buildErrorMessage(`Failed to remove <@&${role.id}> from <@${user.id}>`),
                    ephemeral: true
                });
            }
            break;
        default:
            return await interaction.reply({
                ...buildErrorMessage(`Unknown action '${action}'`),
                ephemeral: true
            });
    }
}