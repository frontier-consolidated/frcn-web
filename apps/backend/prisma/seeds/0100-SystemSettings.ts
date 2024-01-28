import type { PrismaClient } from "@prisma/client";

export async function seed(db: PrismaClient) {
	const roles = await db.userRole.findMany();

	const values = {
		discordGuildId: "1188196981508689950",
		defaultEventChannel: {
			connect: {
				discordId: "1198766089782439956",
			},
		},
		roleOrder: roles.map((role) => role.id),
	};

	await db.systemSettings.upsert({
		where: { unique: true },
		update: values,
		create: values,
	});
}
