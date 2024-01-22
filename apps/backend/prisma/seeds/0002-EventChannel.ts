import { PrismaClient } from "@prisma/client";

export async function seed(db: PrismaClient) {
	await db.eventChannel.upsert({
		where: { discordId: "1198766089782439956" },
		update: {},
		create: {
			discordId: "1198766089782439956",
		},
	});

	await db.eventChannel.upsert({
		where: { discordId: "1198766108006686811" },
		update: {},
		create: {
			discordId: "1198766108006686811",
		},
	});

	await db.eventChannel.upsert({
		where: { discordId: "1198766124163145749" },
		update: {},
		create: {
			discordId: "1198766124163145749",
		},
	});
}
