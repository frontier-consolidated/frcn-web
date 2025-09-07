import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
	type Client,
	type ClientEvents,
	SlashCommandBuilder,
	REST,
	ChatInputCommandInteraction
} from "discord.js";

import { startEventsUpdate } from "./handlers/updateEvents.interval";
import { logger } from "../logger";

type Command = {
	command: SlashCommandBuilder;
	execute: (interaction: ChatInputCommandInteraction) => void | Promise<void>;
};

type EventModule = {
	event: keyof ClientEvents;
	once?: boolean;
	listener: EventListener<keyof ClientEvents>;
};

export type DiscordClient<Ready extends boolean = boolean> = Client<Ready>;

export type EventListener<Event extends keyof ClientEvents> = (
	...args: ClientEvents[Event]
) => void | Promise<void>;

async function registerEvents(client: DiscordClient) {
	const __dirname = path.dirname(fileURLToPath(import.meta.url));
	const eventsFolder = path.join(__dirname, "events");
	const eventFiles = fs
		.readdirSync(eventsFolder)
		.filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

	for (const eventFile of eventFiles) {
		const filePath = path.join(eventsFolder, eventFile);
		const module = (await import(filePath)) as EventModule;

		if (module.once) {
			client.once(module.event, module.listener);
			logger.log(`Registered event listener ${filePath} to once:${module.event}`);
		} else {
			client.on(module.event, module.listener);
			logger.log(`Registered event listener ${filePath} to on:${module.event}`);
		}
	}
}

export async function load(client: DiscordClient, api: REST) {
	await registerEvents(client);

	startEventsUpdate(client);
}
