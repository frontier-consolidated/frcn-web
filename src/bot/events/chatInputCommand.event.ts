import { Events } from "discord.js";

import type { EventListener } from "..";
import { logger } from "../../logger";
import { buildErrorMessage } from "../messages/error.message";

export const event = Events.InteractionCreate;

export const listener: EventListener<"interactionCreate"> = async function (interaction) {
    if (interaction.user.bot || !interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        logger.error(`Received command '${interaction.commandName}' but no command was found`);
        await interaction.reply({
            ...buildErrorMessage("Command not found"),
            ephemeral: true
        });
        return;
    }

    try {
        await command.execute(interaction);
    } catch (err) {
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                ...buildErrorMessage("Action failed! Error while executing command"),
                ephemeral: true
            });
        } else {
            await interaction.reply({
                ...buildErrorMessage("Action failed! Error while executing command"),
                ephemeral: true
            });
        }
        logger.error(`Error while executing command '${interaction.commandName}'`, err);
    }
};