import { Prisma, PrismaClient, UsersInUserRoles } from "@prisma/client";

import { cacheGet } from "../helpers";
import { FullModel } from "../types";

export function createUsersInUserRolesExtension(client: PrismaClient) {
	return Prisma.defineExtension({
		name: "UsersInUserRolesExtension",
		model: {
			usersInUserRoles: {
				async getRole(model: FullModel<UsersInUserRoles>) {
					if (model.role) return model.role;

					const value = await cacheGet(
						model,
						() => {
							return client.userRole.findUnique({
								where: { id: model.roleId },
							});
						},
						{
							prefix: "UserRole",
							id: model.roleId,
						}
					);
					model.role = value;
					return value;
				},
				async getUser(model: FullModel<UsersInUserRoles>) {
					if (model.user) return model.user;

					const value = await cacheGet(
						model,
						() => {
							return client.user.findUnique({
								where: { id: model.userId },
							});
						},
						{
							prefix: "User",
							id: model.userId,
						}
					);
					model.user = value;
					return value;
				},
			},
		},
	});
}
