import { createCommandExecutor } from "@l3dev/discord.js-helpers";

import { errorMessage } from "../messages/error.message";

export const commandExecutor = createCommandExecutor({
	getErrorMessage: (_err, _interaction) => {
		return errorMessage.build("Error while executing command");
	}
});
