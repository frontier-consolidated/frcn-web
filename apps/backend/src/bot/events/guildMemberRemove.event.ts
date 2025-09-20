import { Events } from "discord.js";

import type { EventListener } from "..";
import { $users } from "../../services/users";

export const event = Events.GuildMemberRemove;

export const listener: EventListener<"guildMemberRemove"> = async function (member) {
	const user = await $users.getUserByDiscordId(member.user.id);
	if (!user) return;

	await $users.unauthenticateSessions(user);
};
