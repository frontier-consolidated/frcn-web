import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { type Client, type ClientEvents, Collection, SlashCommandBuilder, REST, ChatInputCommandInteraction, Routes } from "discord.js";

import { startEventsUpdate } from "./handlers/updateEvents.interval";
import { logger } from "../logger";

type Command = {
    command: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => void | Promise<void>
};

type EventModule = {
    event: keyof ClientEvents;
    once?: boolean;
    listener: EventListener<keyof ClientEvents>
};

declare module "discord.js" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Client<Ready extends boolean = boolean> {
        commands: Collection<string, Command>;
    }
}

export type DiscordClient<Ready extends boolean = boolean> = Client<Ready> & {
    commands: Collection<string, Command>;
};

export type EventListener<Event extends keyof ClientEvents> = (...args: ClientEvents[Event]) => void | Promise<void>;

async function registerCommands(client: DiscordClient, api: REST) {
    const commands = new Collection<string, Command>();
    client.commands = commands;

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const commandsFolder = path.join(__dirname, "commands");
    const commandsFiles = fs.readdirSync(commandsFolder).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

    for (const commandFile of commandsFiles) {
        const filePath = path.join(commandsFolder, commandFile);
        const module = (await import(filePath)) as Command;
        
        if ("command" in module && "execute" in module) {
            commands.set(module.command.name, module);
            logger.log(`Registered command '${module.command.name}' (${filePath})`);
        } else {
            logger.warn(`Command file at ${filePath} is missing required command properties: "data", "execute"`);
        }
    }

    const commandJSONs = Array.from(commands.values()).map(command => command.command.toJSON());
    await api.put(Routes.applicationCommands(process.env.DISCORD_CLIENTID), {
        body: commandJSONs
    });
}

async function registerEvents(client: DiscordClient) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const eventsFolder = path.join(__dirname, "events");
    const eventFiles = fs.readdirSync(eventsFolder).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

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
    await registerCommands(client, api);
    await registerEvents(client);

    startEventsUpdate(client);
}