import type { Prisma, User, UserRole } from "../__generated__/client";

import { $users } from "./users";
import { database } from "../database";
import type { RoleEditInput } from "../graphql/__generated__/resolvers-types";
import { publishRolesUpdated, publishUserRolesUpdated } from "../graphql/events";

async function getRole(id: string) {
	return await database.userRole.findUnique({
		where: { id }
	});
}

async function getRoleByDiscordId(id: string) {
	return await database.userRole.findUnique({
		where: { discordId: id }
	});
}

async function getAllRoles<T extends Prisma.UserRoleFindManyArgs>(
	args?: Prisma.SelectSubset<T, Prisma.UserRoleFindManyArgs>
) {
	const roles = await database.userRole.findMany<T>(args);
	if (roles.length > 0 && "order" in roles[0]) {
		roles.sort((a, b) => (a as { order: number }).order - (b as { order: number }).order);
	}
	return roles;
}

async function getDefaultPrimaryRole() {
	let defaultPrimaryRole = await database.userRole.findFirst({
		where: {
			primary: true
		},
		orderBy: {
			order: "asc"
		}
	});

	if (defaultPrimaryRole) return defaultPrimaryRole;

	defaultPrimaryRole = await createRole({
		name: "default",
		primary: true
	});
	return defaultPrimaryRole;
}

async function getRoleUsers<T extends Prisma.UserFindManyArgs>(
	role: UserRole,
	args?: Prisma.Subset<T, Prisma.UserFindManyArgs>
) {
	if (role.primary) {
		const users = await database.userRole
			.findUnique({
				where: { id: role.id }
			})
			.primaryUsers<T>(args);
		return users ?? [];
	}

	const userLinks = await database.userRole
		.findUnique({
			where: { id: role.id }
		})
		.users({
			where: args?.where
				? {
						user: args.where
					}
				: undefined,
			include: {
				user:
					args?.select || args?.include
						? {
								select: args.select,
								include: args.include
							}
						: true
			},
			take: args?.take,
			skip: args?.skip
		});
	return userLinks ? userLinks.map((ul) => ul.user) : [];
}

async function createRole(data?: Partial<Prisma.UserRoleCreateInput>) {
	const role = await database.$transaction(async (tx) => {
		await tx.$executeRaw`UPDATE "user"."roles" SET "order" = "order" + 1`;

		return await tx.userRole.create({
			data: {
				name: "new role",
				permissions: 0,
				order: 0,
				...data
			}
		});
	});

	await publishRolesUpdated();
	return role;
}

async function editRole(role: UserRole, data: RoleEditInput) {
	if (role.primary && data.primary === false) {
		const users = await getRoleUsers(role);

		if (users.length > 0) {
			const newRole =
				data.newPrimaryRole &&
				(await database.userRole.findUnique({
					where: { id: data.newPrimaryRole }
				}));
			if (!newRole || !newRole.primary) return null;

			await database.user.updateMany({
				where: {
					id: {
						in: users.map((u) => u.id)
					}
				},
				data: {
					primaryRoleId: newRole.id
				}
			});
		}
	}

	const updatedRole = await database.userRole.update({
		where: { id: role.id },
		data: {
			name: data.name ?? undefined,
			discordId: data.discordId,
			primary: data.primary ?? undefined,
			permissions: data.permissions ?? undefined
		},
		include: {
			primaryUsers: true,
			users: {
				include: {
					user: true
				}
			}
		}
	});

	publishUserRolesUpdated(
		updatedRole.primary ? updatedRole.primaryUsers : updatedRole.users.map((u) => u.user)
	);
	await publishRolesUpdated();

	return updatedRole;
}

async function reorderRoles(order: string[]) {
	await Promise.all(
		order.map(
			async (id, order) =>
				await database.userRole.update({
					where: { id },
					data: { order }
				})
		)
	);

	await publishRolesUpdated();
}

async function deleteRole(role: UserRole) {
	await database.$transaction(async (tx) => {
		await tx.userRole.delete({
			where: { id: role.id }
		});

		await tx.$executeRaw`UPDATE "user"."roles" SET "order" = "order" - 1 WHERE "order" > ${role.order}`;
	});

	await publishRolesUpdated();
}

async function hasPrimaryRolePrivileges(role: UserRole, user: User) {
	if (!role.primary)
		throw new Error(`Checking hasPrimaryRolePrivileges() with non-primary role ${role.name}`);

	if (user.primaryRoleId === role.id) return true;

	const primaryRole = await getRole(user.primaryRoleId);
	return (primaryRole?.order ?? -1) >= role.order;
}

async function hasRole(role: UserRole, user: User) {
	if (role.primary) return user.primaryRoleId == role.id;

	const throughRoles = await $users.getRoles(user.id);
	for (const throughRole of throughRoles) {
		if (throughRole.roleId == role.id) return true;
	}
	return false;
}

async function hasOneOfRoles(roles: UserRole[], user: User) {
	for (const role of roles) {
		if (await hasRole(role, user)) return true;
	}
	return false;
}

async function changePrimaryRole(role: UserRole, user: User) {
	if (!role.primary) throw new Error("Use giveRole()/removeRole() to add/remove non primary roles");

	await database.user.update({
		where: { id: user.id },
		data: {
			primaryRole: {
				connect: {
					id: role.id
				}
			}
		}
	});

	publishUserRolesUpdated([user]);
	await publishRolesUpdated();
}

async function giveRole(role: UserRole, user: User) {
	if (role.primary) throw new Error("Use changePrimaryRole() to change a user's primary role");

	await database.user.update({
		where: { id: user.id },
		data: {
			roles: {
				create: {
					role: {
						connect: {
							id: role.id
						}
					}
				}
			}
		}
	});

	publishUserRolesUpdated([user]);
	await publishRolesUpdated();
}

async function removeRole(role: UserRole, user: User) {
	if (role.primary) throw new Error("Use changePrimaryRole() to change a user's primary role");

	await database.user.update({
		where: { id: user.id },
		data: {
			roles: {
				delete: {
					roleId_userId: {
						roleId: role.id,
						userId: user.id
					}
				}
			}
		}
	});

	publishUserRolesUpdated([user]);
	await publishRolesUpdated();
}

function resolvePermissions(roles: UserRole[]) {
	let permissions = 0;
	for (const role of roles) {
		permissions |= role.permissions;
	}
	return permissions;
}

export const $roles = {
	getRole,
	getRoleByDiscordId,
	getAllRoles,
	getDefaultPrimaryRole,
	getRoleUsers,
	createRole,
	editRole,
	reorderRoles,
	deleteRole,
	hasPrimaryRolePrivileges,
	hasRole,
	hasOneOfRoles,
	changePrimaryRole,
	giveRole,
	removeRole,
	resolvePermissions
};
