import { randomUUID } from "crypto";

import type { AccessKey } from "@prisma/client";
import * as bcrypt from "bcrypt";

import { database } from "../database";
import type { AccessKeyEditInput, SystemEditInput } from "../graphql/__generated__/resolvers-types";

const ACCESS_KEY_SALT_ROUNDS = 12

async function getSystemSettings() {
	return await database.systemSettings.findFirstOrThrow({
		include: {
			defaultEventChannel: true,
		},
	});
}

async function editSystemSettings(data: SystemEditInput) {
	return await database.systemSettings.update({
		where: { unique: true },
		data: {
			discordGuildId: data.discordGuildId ?? undefined,
			defaultEventChannel: data.defaultEventChannelId ? {
				connect: {
					id: data.defaultEventChannelId
				} 
			} : undefined
		},
		include: {
			defaultEventChannel: true
		}
	})
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

async function getAccessKeyById(id: number) {
	return await database.accessKey.findUnique({
		where: { id }
	})
}

async function getAllAccessKeys() {
	return await database.accessKey.findMany()
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

async function editAccessKey(accessKey: AccessKey, data: AccessKeyEditInput) {
	return await database.accessKey.update({
		where: { id: accessKey.id },
		data: {
			description: data.description ?? undefined,
			permissions: data.permissions ?? undefined
		}
	})
}

async function regenerateAccessKey(accessKey: AccessKey) {
	const key = randomUUID()
	const hash = await bcrypt.hash(key, ACCESS_KEY_SALT_ROUNDS)

	await database.accessKey.update({
		where: { id: accessKey.id },
		data: {
			hashedKey: hash
		}
	})

	return encodeKey(accessKey.id, key)
}

async function deleteAccessKey(accessKey: AccessKey) {
	await database.accessKey.delete({
		where: { id: accessKey.id }
	})
}

export const $system = {
	getSystemSettings,
	editSystemSettings,
	getAccessKey,
	getAccessKeyById,
	getAllAccessKeys,
	createAccessKey,
	editAccessKey,
	regenerateAccessKey,
	deleteAccessKey
};
