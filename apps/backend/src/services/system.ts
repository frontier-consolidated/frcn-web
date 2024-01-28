import { database } from "../database";

async function getSystemSettings() {
	return await database.systemSettings.findFirstOrThrow({
		include: {
			defaultEventChannel: true,
		},
	});
}

export const $system = {
	getSystemSettings,
};
