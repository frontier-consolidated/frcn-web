import type { PrismaClient } from "@prisma/client";

export async function seed(db: PrismaClient) {
	const developerRole = await db.userRole.findUniqueOrThrow({
		where: { id: "5ea9732c-7604-4c01-9ac9-303d4f4fa2f9" },
	});

	await db.user.upsert({
		where: { discordId: "255733848162304002" },
		update: {},
		create: {
			discordId: "255733848162304002",
			discordName: "SyntheticDev",
			scVerified: false,
			avatarUrl:
				"https://cdn.discordapp.com/avatars/255733848162304002/1a3ec4f7f63ed9b224f98fbeb1047e6e.webp",
			primaryRole: {
				connect: {
					id: developerRole.id,
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
}
