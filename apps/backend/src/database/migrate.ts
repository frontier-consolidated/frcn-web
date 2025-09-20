import type { database as Database } from ".";

export async function migrate(database: typeof Database) {
	// const systemSettings = await database.systemSettings.findUnique({
	// 	where: { unique: true },
	// 	select: {
	// 		roleOrder: true,
	// 		roleOrderMigrated: true
	// 	}
	// });
	// if (!systemSettings) return;
	// if (systemSettings.roleOrderMigrated !== false) return;
	// await database.$transaction(async (tx) => {
	// 	const roles = await tx.userRole.findMany();
	// 	for (const role of roles) {
	// 		if (role.order >= 0) continue;
	// 		const order = $roles.getRoleOrder(role.id, systemSettings.roleOrder);
	// 		await tx.userRole.update({
	// 			where: { id: role.id },
	// 			data: { order }
	// 		});
	// 	}
	// 	await tx.systemSettings.update({
	// 		where: { unique: true },
	// 		data: {
	// 			roleOrderMigrated: true,
	// 			roleOrder: []
	// 		}
	// 	});
	// });
}
