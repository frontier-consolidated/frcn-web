import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

import { type Client, type ClientEvents } from "discord.js";

import { logger } from "../logger";
import { startEventsUpdate } from "./handlers/updateEvents.interval";

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
		const module = (await import(pathToFileURL(filePath).toString())) as EventModule;

		if (module.once) {
			client.once(module.event, module.listener);
			logger.log(`Registered event listener ${filePath} to once:${module.event}`);
		} else {
			client.on(module.event, module.listener);
			logger.log(`Registered event listener ${filePath} to on:${module.event}`);
		}
	}
}

export async function load(client: DiscordClient) {
	await registerEvents(client);

	startEventsUpdate(client);
}
