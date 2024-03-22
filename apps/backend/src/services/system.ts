import * as bcrypt from "bcrypt";

import { database } from "../database";

const ACCESS_KEY_SALT_ROUNDS = 12

async function getSystemSettings() {
	return await database.systemSettings.findFirstOrThrow({
		include: {
			defaultEventChannel: true,
		},
	});
}

async function getAccessKey(key: string) {
	const hash = await bcrypt.hash(key, ACCESS_KEY_SALT_ROUNDS)
	return await database.accessKey.findUnique({
		where: { hashedKey: hash }
	})
}

export const $system = {
	getSystemSettings,
	getAccessKey
};
