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

function encodeKey(id: number, uuid: string) {
	return Buffer.from(`${id}.${uuid}`, "utf-8").toString("base64url")
}

function decodeKey(key: string) {
	const [idString, uuid] = Buffer.from(key, "base64url").toString("utf-8").split(".")
	if (!idString || !uuid) return null;

	const id = Number(idString)
	if (isNaN(id)) return null;

	return {id, uuid}
}

async function getAccessKey(key: string) {
	const keyData = decodeKey(key)
	if (!keyData) return null;

	const accessKey = await database.accessKey.findUnique({
		where: { id: keyData.id }
	})
	if (!accessKey) return null;

	const match = await bcrypt.compare(keyData.uuid, accessKey.hashedKey)
	if (!match) return null;
	return accessKey;
}

async function createAccessKey() {
	const uuid = randomUUID()
	const hash = await bcrypt.hash(uuid, ACCESS_KEY_SALT_ROUNDS)

	const accessKey = await database.accessKey.create({
		data: {
			hashedKey: hash,
			description: "",
			permissions: 0
		}
	})
	return [accessKey, encodeKey(accessKey.id, uuid)] as const;
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

	return encodeKey(id, key)
}

export const $system = {
	getSystemSettings,
	getAccessKey,
	createAccessKey,
	regenerateAccessKey
};
