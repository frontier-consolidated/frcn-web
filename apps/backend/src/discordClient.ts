import { Client, GatewayIntentBits, REST } from "discord.js";

export function createDiscordClient() {
	const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
	const client = new Client({
		intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds],
	});

	return {
		client,
		rest,
	};
}
