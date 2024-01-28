import { type APIUser, CDNRoutes, ImageFormat } from "discord.js";

import { $roles } from "./roles";
import { database } from "../database";

async function getUser(id: string) {
	const user = await database.user.findUnique({
		where: { id },
	});
	return user;
}

async function getOrCreateUser(discordUser: APIUser) {
	const defaultPrimaryRole = await $roles.getDefaultPrimaryRole();

	const user = await database.user.upsert({
		where: {
			discordId: discordUser.id,
		},
		update: {},
		create: {
			discordId: discordUser.id,
			discordName: discordUser.global_name
				? discordUser.global_name
				: discordUser.discriminator === "0"
				? `@${discordUser.username}`
				: `${discordUser.username}#${discordUser.discriminator}`,
			scName: null,
			scVerified: false,
			avatarUrl:
				"https://cdn.discordapp.com" +
				CDNRoutes.userAvatar(discordUser.id, discordUser.avatar, ImageFormat.WebP),
			primaryRole: {
				connect: {
					id: defaultPrimaryRole.id,
				},
			},
			status: {
				create: {},
			},
			settings: {
				create: {},
			},
		},
	});

	return user;
}

export const $users = {
	getUser,
	getOrCreateUser,
};
