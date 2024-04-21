import fs from "fs";
import path from "path";

import type { UserRole } from "@prisma/client";
import { type Client, Collection, SlashCommandBuilder, REST, ChatInputCommandInteraction, Routes } from "discord.js";

import { eventInteraction } from "./handlers/event.interaction";
import { eventDmInteraction } from "./handlers/eventDm.interaction";
import { startEventsUpdate } from "./handlers/updateEvents.interval";
import { buildErrorMessage } from "./messages/error.message";
import { database } from "../database";
import { publishRolesUpdated, publishUserRolesUpdated } from "../graphql/events";
import { logger } from "../logger";
import { $discord } from "../services/discord";
import { $roles } from "../services/roles";
import { $users } from "../services/users";

type Command = {
    command: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => void | Promise<void>
};

declare module "discord.js" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Client<Ready extends boolean = boolean> {
        commands: Collection<string, Command>;
    }
}

export type DiscordClient<Ready extends boolean = boolean> = Client<Ready> & {
    commands: Collection<string, Command>;
};

async function registerCommands(client: DiscordClient, api: REST) {
    const commands = new Collection<string, Command>();
    client.commands = commands;

    const __dirname = path.dirname(import.meta.url);
    const commandsFolder = path.join(__dirname, "commands");
    const commandsFiles = fs.readdirSync(commandsFolder).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

    for (const commandFile of commandsFiles) {
        const filePath = path.join(commandsFolder, commandFile);
        const module = (await import(filePath)) as Command;
        
        if ("command" in module && "execute" in module) {
            commands.set(module.command.name, module);
        } else {
            logger.warn(`Command file at ${filePath} is missing required command properties: "data", "execute"`);
        }
    }

    const commandJSONs = Array.from(commands.values()).map(command => command.command.toJSON());
    await api.put(Routes.applicationCommands(process.env.DISCORD_CLIENTID), {
        body: commandJSONs
    });
}

async function commandInteraction(interaction: ChatInputCommandInteraction) {
    const command = (interaction.client as DiscordClient).commands.get(interaction.commandName);

    if (!command) {
        logger.error(`Received command '${interaction.commandName}' but no command was found`);
        await interaction.reply({
            ...buildErrorMessage("Command not found"),
            ephemeral: true
        });
        return;
    }

    try {
        await command.execute(interaction);
    } catch (err) {
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                ...buildErrorMessage("Action failed! Error while executing command"),
                ephemeral: true
            });
        } else {
            await interaction.reply({
                ...buildErrorMessage("Action failed! Error while executing command"),
                ephemeral: true
            });
        }
        logger.error(`Error while executing command '${interaction.commandName}'`, err);
    }
}

export async function load(client: DiscordClient, api: REST) {
    await registerCommands(client, api);

    client.on("interactionCreate", async (interaction) => {
        if (interaction.user.bot) return;

        try {
            if (interaction.isMessageComponent()) {
                if (!interaction.channel || interaction.channel.isDMBased()) {
                    await eventDmInteraction(interaction);
                } else {
                    await eventInteraction(interaction);
                }
            } else if (interaction.isChatInputCommand()) {
                await commandInteraction(interaction);
            }
        } catch (err) {
            logger.error("Error during interaction:", err);
        }
    });

    client.on("guildMemberUpdate", async (oldMember, newMember) => {
        const user = await $users.getUserByDiscordId(newMember.user.id);
        if (!user) return;

        const { added, removed } = $discord.getGuildMemberRoleDiffs(oldMember.roles, newMember.roles);

        if (added.length + removed.length === 0) return;

        const currentUserRoles = await $users.getAllRoles(user);
        const currentConnectedDiscordRoles = currentUserRoles.filter(role => !!role.discordId);

        const allMemberRoles = Array.from(newMember.roles.cache.values());
        const connectedPrimaryDiscordRoles = await $roles.getAllRoles({
            where: {
                primary: true,
                discordId: {
                    in: allMemberRoles.map(role => role.id)
                }
            }
        });

        const currentPrimaryRole = currentUserRoles.find(role => role.primary);

        let fallbackPrimaryRole: UserRole | null = null;
        let newPrimaryRole: UserRole | null = null;
        
        for (const role of connectedPrimaryDiscordRoles) {
            if (role.order < (currentPrimaryRole?.order ?? -1) && role.order > (fallbackPrimaryRole?.order ?? -1)) {
                fallbackPrimaryRole = role;
            }
        }

        const rolesToGive: UserRole[] = [];

        for (const discordRole of added) {
            const role = await $roles.getRoleByDiscordId(discordRole.id);
            if (!role) continue;

            const hasRole = !!currentConnectedDiscordRoles.find(r => r.id === role.id);
            if (hasRole) continue;

            if (role.primary) {
                if (role.order > (currentPrimaryRole?.order ?? -1) && (!newPrimaryRole || role.order > newPrimaryRole.order)) {
                    newPrimaryRole = role;
                } else if (role.order < (currentPrimaryRole?.order ?? -1) && role.order > (fallbackPrimaryRole?.order ?? -1)) {
                    fallbackPrimaryRole = role;
                }
            } else {
                rolesToGive.push(role);
            }
        }
        
        const rolesToRemove: UserRole[] = [];

        for (const discordRole of removed) {
            const role = await $roles.getRoleByDiscordId(discordRole.id);
            if (!role) continue;

            const hasRole = !!currentConnectedDiscordRoles.find(r => r.id === role.id);
            if (!hasRole) continue;

            if (role.primary) {
                if (!newPrimaryRole && role.id === currentPrimaryRole?.id) {
                    newPrimaryRole = fallbackPrimaryRole ?? await $roles.getDefaultPrimaryRole();
                }
            } else {
                rolesToRemove.push(role);
            }
        }

        if (newPrimaryRole || rolesToGive.length > 0 || rolesToRemove.length > 0) {
            await database.user.update({
                where: { id: user.id },
                data: {
                    primaryRole: newPrimaryRole ? {
                        connect: {
                            id: newPrimaryRole.id
                        }
                    } : undefined,
                    roles: rolesToGive.length > 0 || rolesToRemove.length > 0 ? {
                        create: rolesToGive.length > 0 ? rolesToGive.map(role => ({
                            roleId: role.id
                        })) : undefined,
                        deleteMany: rolesToRemove.length > 0 ? {
                            roleId: {
                                in: rolesToRemove.map(role => role.id)
                            }
                        } : undefined
                    } : undefined
                }
            });
        
            publishUserRolesUpdated([user]);
            await publishRolesUpdated();
        }
    });

    client.on("guildMemberAdd", async (member) => {
        const defaultRole = await $roles.getDefaultPrimaryRole();
        if (!defaultRole.discordId) return;

        if (member.roles.cache.has(defaultRole.discordId)) return;
        try {
            await member.roles.add(defaultRole.discordId);
        } catch (err) {
            console.error(`Failed to add default discord role (${defaultRole.discordId}) to user ${member.nickname ?? member.displayName} (${member.user.id})`);
        }
    });

    client.on("guildMemberRemove", async (member) => {
        const user = await $users.getUserByDiscordId(member.user.id);
        if (!user) return;

        await $users.unauthenticateSessions(user);
    });

    startEventsUpdate(client);
}