import { randomUUID } from "crypto";

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

async function createAccessKey() {
	const key = randomUUID()
	const hash = await bcrypt.hash(key, ACCESS_KEY_SALT_ROUNDS)

	const accessKey = await database.accessKey.create({
		data: {
			hashedKey: hash,
			description: "",
			permissions: 0
		}
	})
	return [accessKey, key] as const;
}

async function regenerateAccessKey(id: number) {
	const key = randomUUID()
	const hash = await bcrypt.hash(key, ACCESS_KEY_SALT_ROUNDS)

	await database.accessKey.update({
		where: { id },
		data: {
			hashedKey: hash
		}
	})

	return key
}

export const $system = {
	getSystemSettings,
	getAccessKey,
	createAccessKey,
	regenerateAccessKey
};
