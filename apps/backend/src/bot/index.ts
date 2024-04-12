import { type Client, InteractionType } from "discord.js";

import { eventInteraction } from "./handlers/event.interaction";
import { eventDmInteraction } from "./handlers/eventDm.interaction";
import { startEventsUpdate } from "./handlers/updateEvents.interval";
import { logger } from "../logger";
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

        // const { added, removed } = $discord.getGuildMemberRoleDiffs(oldMember.roles, newMember.roles)

        // for (const role of added) {
        //     const userRole 
        // }
        // newMember.roles.
    });

    client.on("guildMemberRemove", async (member) => {
        const user = await $users.getUserByDiscordId(member.user.id);
        if (!user) return;

        await $users.unauthenticateSessions(user);
    });

    startEventsUpdate(client);
}