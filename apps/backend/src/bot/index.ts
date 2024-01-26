import { Client } from "discord.js";

export function load(client: Client) {
    client.on("interactionCreate", (interaction) => {
        if (interaction.user.bot) return;

        console.log(interaction)
    })
}