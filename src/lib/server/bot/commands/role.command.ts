import {
	addSubcommands,
	createSubcommandExecutor,
	defineCommand,
	loadSubcommands
} from "@l3dev/discord.js-helpers";
import { logger } from "@l3dev/logger";
import { Result } from "@l3dev/result";
import { MessageFlags } from "discord.js";

import { commandExecutor } from "./executor";
import { errorMessage } from "../messages/error.message";

const name = "role";

const subcommands = loadSubcommands({
	parentCommandName: name,
	getModules<T>() {
		return import.meta.glob<true, string, T>("./role/*.command.ts", { eager: true });
	},
	logger
});

const subcommandExecutor = createSubcommandExecutor({
	subcommands,
	commandExecutor,
	getNotFoundMessage(subcommandName, _interaction) {
		return errorMessage.build(`Unknown subcommand '${subcommandName}'`);
	}
});

export default defineCommand({
	name,
	subcommands,
	define(builder) {
		builder = builder.setName(this.name).setDescription("Manage roles for users");
		addSubcommands(builder, subcommands);

		return builder;
	},
	async execute(interaction) {
		if (!interaction.inGuild() || !interaction.guild) {
			return await Result.fromPromise(
				interaction.reply({
					...errorMessage.build("Command must be used in a guild").value,
					flags: MessageFlags.Ephemeral
				})
			);
		}

		return await subcommandExecutor(interaction);
	}
});
