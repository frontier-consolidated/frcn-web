import { Events } from "discord.js";

import type { EventListener } from "..";
import { logger } from "../../logger";
import { $roles } from "../../services/roles";

export const event = Events.GuildMemberAdd;

export const listener: EventListener<"guildMemberAdd"> = async function (member) {
    const defaultRole = await $roles.getDefaultPrimaryRole();
    if (!defaultRole.discordId) return;

    if (member.roles.cache.has(defaultRole.discordId)) return;
    try {
        await member.roles.add(defaultRole.discordId);
    } catch (err) {
        logger.error(`Failed to add default discord role (${defaultRole.discordId}) to user ${member.nickname ?? member.displayName} (${member.user.id})`, err);
    }
};