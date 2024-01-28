import type { PrismaClient } from "@prisma/client";

export async function seed(db: PrismaClient) {
	const orgMemberRole = await db.userRole.findUniqueOrThrow({
		where: { name: "Org Member" },
	});

	const developerRole = await db.userRole.findUniqueOrThrow({
		where: { name: "Developer" },
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
					id: orgMemberRole.id,
				},
			},
			roles: {
				create: [
					{
						role: {
							connect: {
								id: developerRole.id,
							},
						},
					},
				],
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
