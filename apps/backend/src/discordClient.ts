import { Client, GatewayIntentBits, REST } from "discord.js";

import { load, type DiscordClient } from "./bot";

export async function createDiscordClient(token: string) {
	const rest = new REST({ version: "10" }).setToken(token);
	const client = new Client({
		intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions],
	}) as DiscordClient;

	await load(client, rest);

	return {
		client,
		rest,
	};
}
