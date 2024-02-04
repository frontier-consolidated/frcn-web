import { Client, GatewayIntentBits, REST } from "discord.js";

import { load } from "./bot";

export function createDiscordClient(token: string) {
	const rest = new REST({ version: "10" }).setToken(token);
	const client = new Client({
		intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
	});

	load(client)

	return {
		client,
		rest,
	};
}
