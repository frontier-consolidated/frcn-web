import type { UserRole } from "@prisma/client";
import { type Client, InteractionType } from "discord.js";

import { eventInteraction } from "./handlers/event.interaction";
import { eventDmInteraction } from "./handlers/eventDm.interaction";
import { startEventsUpdate } from "./handlers/updateEvents.interval";
import { database } from "../database";
import { publishRolesUpdated, publishUserRolesUpdated } from "../graphql/events";
import { logger } from "../logger";
import { $discord } from "../services/discord";
import { $roles } from "../services/roles";
import { $users } from "../services/users";

export function load(client: Client) {
    client.on("interactionCreate", async (interaction) => {
        if (interaction.user.bot) return;

        try {
            if (interaction.type === InteractionType.MessageComponent) {
                if (!interaction.channel || interaction.channel.isDMBased()) {
                    await eventDmInteraction(interaction);
                } else {
                    await eventInteraction(interaction);
                }
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

    client.on("guildMemberRemove", async (member) => {
        const user = await $users.getUserByDiscordId(member.user.id);
        if (!user) return;

        await $users.unauthenticateSessions(user);
    });

    startEventsUpdate(client);
}