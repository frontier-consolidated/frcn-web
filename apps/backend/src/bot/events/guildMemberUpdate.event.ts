import type { User, UserRole } from "@prisma/client";
import { Events, GuildMember, type PartialGuildMember } from "discord.js";

import type { EventListener } from "..";
import { database } from "../../database";
import { publishRolesUpdated, publishUserRolesUpdated } from "../../graphql/events";
import { $discord } from "../../services/discord";
import { $roles } from "../../services/roles";
import { $users } from "../../services/users";

export const event = Events.GuildMemberUpdate;

export async function diffCheckUser(
	newMember: GuildMember,
	oldMember: GuildMember | PartialGuildMember | null,
	onUpdate?: (user: User) => void
) {
	const user = await $users.getOrCreateUser(newMember.user, newMember.client);

	let updated = false;

	let newName: string | null = newMember.nickname ?? newMember.displayName;
	if (user.discordName !== newName) {
		updated = true;
	} else {
		newName = null;
	}

	const addedRoles: UserRole[] = [];
	const removedRoles: UserRole[] = [];

	const currentUserRoles = await $users.getAllRoles(user);
	const currentConnectedDiscordRoles = currentUserRoles.filter((role) => !!role.discordId);

	if (oldMember) {
		const { added, removed } = $discord.getGuildMemberRoleDiffs(
			oldMember.roles,
			newMember.roles
		);
		for (const discordRole of added) {
			const role = await $roles.getRoleByDiscordId(discordRole.id);
			if (!role) continue;

			addedRoles.push(role);
		}
		for (const discordRole of removed) {
			const role = await $roles.getRoleByDiscordId(discordRole.id);
			if (!role) continue;

			removedRoles.push(role);
		}
	} else {
		const oldRoles = currentConnectedDiscordRoles;
		const newRoles: UserRole[] = [];
		for (const discordRole of newMember.roles.cache.values()) {
			const role = await $roles.getRoleByDiscordId(discordRole.id);
			if (!role) continue;

			newRoles.push(role);
		}

		for (const role of oldRoles) {
			if (newRoles.find((r) => r.id === role.id)) continue;
			removedRoles.push(role);
		}

		for (const role of newRoles) {
			if (oldRoles.find((r) => r.id === role.id)) continue;
			addedRoles.push(role);
		}
	}

	let newPrimaryRole: UserRole | null = null;
	const rolesToGive: UserRole[] = [];
	const rolesToRemove: UserRole[] = [];

	if (addedRoles.length + removedRoles.length > 0) {
		const allMemberRoles = Array.from(newMember.roles.cache.values());
		const connectedPrimaryDiscordRoles = await $roles.getAllRoles({
			where: {
				primary: true,
				discordId: {
					in: allMemberRoles.map((role) => role.id)
				}
			}
		});

		const currentPrimaryRole = currentUserRoles.find((role) => role.primary);

		let fallbackPrimaryRole: UserRole | null = null;
		for (const role of connectedPrimaryDiscordRoles) {
			if (
				role.order < (currentPrimaryRole?.order ?? -1) &&
				role.order > (fallbackPrimaryRole?.order ?? -1)
			) {
				fallbackPrimaryRole = role;
			}
		}

		for (const role of addedRoles) {
			const hasRole = !!currentConnectedDiscordRoles.find((r) => r.id === role.id);
			if (hasRole) continue;

			if (role.primary) {
				if (
					role.order > (currentPrimaryRole?.order ?? -1) &&
					(!newPrimaryRole || role.order > newPrimaryRole.order)
				) {
					newPrimaryRole = role;
				} else if (
					role.order < (currentPrimaryRole?.order ?? -1) &&
					role.order > (fallbackPrimaryRole?.order ?? -1)
				) {
					fallbackPrimaryRole = role;
				}
			} else {
				rolesToGive.push(role);
			}
		}

		for (const role of removedRoles) {
			const hasRole = !!currentConnectedDiscordRoles.find((r) => r.id === role.id);
			if (!hasRole) continue;

			if (role.primary) {
				if (!newPrimaryRole && role.id === currentPrimaryRole?.id) {
					newPrimaryRole = fallbackPrimaryRole ?? (await $roles.getDefaultPrimaryRole());
				}
			} else {
				rolesToRemove.push(role);
			}
		}

		updated = true;
	}

	if (!updated) {
		return;
	}

	const updatedUser = await database.user.update({
		where: { id: user.id },
		data: {
			discordName: newName ? newName : undefined,
			primaryRole: newPrimaryRole
				? {
						connect: {
							id: newPrimaryRole.id
						}
				  }
				: undefined,
			roles:
				rolesToGive.length > 0 || rolesToRemove.length > 0
					? {
							create:
								rolesToGive.length > 0
									? rolesToGive.map((role) => ({
											roleId: role.id
									  }))
									: undefined,
							deleteMany:
								rolesToRemove.length > 0
									? {
											roleId: {
												in: rolesToRemove.map((role) => role.id)
											}
									  }
									: undefined
					  }
					: undefined
		}
	});

	onUpdate?.(updatedUser);
}

export const listener: EventListener<"guildMemberUpdate"> = async function (oldMember, newMember) {
	diffCheckUser(newMember, oldMember, async (user) => {
		publishUserRolesUpdated([user]);
		await publishRolesUpdated();
	});
};
