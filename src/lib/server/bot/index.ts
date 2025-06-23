import botTickets from "@l3dev/discord-bot-tickets-plugin";
import { createBot } from "@l3dev/discord.js-helpers";
import { logger } from "@l3dev/logger";
import { ActivityType } from "discord.js";

import { env } from "$env/dynamic/private";
import { config } from "$lib/config";
import { db } from "$server/db";

import { commands } from "./commands";
import { commandExecutor } from "./commands/executor";
import { eventListeners } from "./events";

export async function startDiscordBot() {
	const client = createBot({
		plugins: [botTickets({ db })],
		clientOptions: {
			intents: ["Guilds", "GuildMembers", "GuildMessagePolls"],
			presence: {
				activities: [
					{
						type: ActivityType.Custom,
						name: config.domain,
						url: `https://${config.domain}`
					}
				]
			}
		},
		commandExecutor,
		commands,
		removeCommands: {
			global: ["clearrole", "role", "rm_org_member_community_role"]
		},
		eventListeners,
		logger,
		ignoreCommand(interaction) {
			return interaction.guildId !== env.DISCORD_GUILD_ID;
		}
	});

	client.login(env.DISCORD_TOKEN);
}
