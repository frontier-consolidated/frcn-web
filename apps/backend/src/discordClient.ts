import { Client, GatewayIntentBits, REST } from "discord.js";

import { load } from "./bot";

export function createDiscordClient() {
	const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
	const client = new Client({
		intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
	});

	load(client)

	return {
		client,
		rest,
	};
}
