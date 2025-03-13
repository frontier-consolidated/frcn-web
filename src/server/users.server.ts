import type { Prisma, User } from "@prisma/client";

import { database } from "./database.server";
import { event_emitter } from "./event-emitter.server";
import { uploadapi } from "./uploads";

export async function user_exists(uuid: string) {
	return (
		(await database.user.count({
			where: {
				minecraft_uuid: uuid
			}
		})) > 0
	);
}

export function get_user(id: number) {
	return database.user.findUnique({ where: { id } });
}

export function get_user_by_uuid(uuid: string) {
	return database.user.findUnique({
		where: {
			minecraft_uuid: uuid
		}
	});
}

export function get_user_by_username(username: string) {
	return database.user.findFirst({
		where: {
			username: username
		}
	});
}

export function get_all_users(data: Prisma.UserFindManyArgs = {}) {
	return database.user.findMany({
		...data,
		orderBy: {
			created_at: "asc",
			...data.orderBy
		}
	});
}

type CreateUserData = {
	email: string | null;
	minecraft_uuid: string;
	username: string;
	skin_url: string;
};

export async function register_user(data: CreateUserData) {
	const user = await database.user.upsert({
		where: {
			minecraft_uuid: data.minecraft_uuid
		},
		update: {
			email: data.email,
			username: data.username,
			skin_url: data.skin_url,
			registered: true
		},
		create: {
			email: data.email,
			minecraft_uuid: data.minecraft_uuid,
			username: data.username,
			skin_url: data.skin_url,
			registered: true
		}
	});

	event_emitter.emit("user_created", user);
	return user;
}

type CreatePlaceholderUserData = {
	minecraft_uuid: string;
	username: string;
	skin_url: string;
};

export async function create_placeholder_user(data: CreatePlaceholderUserData) {
	const user = await database.user.create({
		data: {
			minecraft_uuid: data.minecraft_uuid,
			username: data.username,
			skin_url: data.skin_url,
			registered: false
		}
	});

	event_emitter.emit("user_created", user);
	return user;
}

export async function update_user(user: User | { id: number }, data: Prisma.UserUpdateInput) {
	const updated_user = await database.user.update({
		where: {
			id: user.id
		},
		data
	});

	event_emitter.emit("user_updated", updated_user);
	return updated_user;
}

export async function update_user_last_online_at(uuid: string) {
	const user = await database.user.update({
		where: {
			minecraft_uuid: uuid
		},
		data: {
			last_online_at: new Date()
		}
	});

	event_emitter.emit("user_updated", user);
	return user;
}

export async function set_user_member_card_image(
	user: User | { id: number },
	season: number,
	key: string
) {
	let member_card = await database.userMemberCard.upsert({
		where: {
			user_id_season: {
				user_id: user.id,
				season
			}
		},
		create: {
			user: {
				connect: {
					id: user.id
				}
			},
			season,
			image_file_key: key
		},
		update: {}
	});

	if (member_card.image_file_key && member_card.image_file_key !== key) {
		await uploadapi.deleteFiles(member_card.image_file_key);

		member_card = await database.userMemberCard.update({
			where: {
				id: member_card.id
			},
			data: {
				image_file_key: key
			}
		});
	}

	event_emitter.emit("user_member_card_updated", member_card);
	return member_card;
}

export async function delete_user(user: User) {
	const cards = await database.userMemberCard.findMany({
		where: { user_id: user.id }
	});
	if (cards.length > 0) {
		await uploadapi.deleteFiles(cards.map((card) => card.image_file_key));
	}

	const deleted_user = await database.user.delete({
		where: { id: user.id }
	});

	event_emitter.emit("user_deleted", deleted_user);
	return deleted_user;
}
