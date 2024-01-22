import { Permission, permissions } from "@frcn/shared";
import { PrismaClient } from "@prisma/client";

export async function seed(db: PrismaClient) {
	await db.userRole.upsert({
		where: { name: "Community" },
		update: {},
		create: {
			name: "Community",
			discordId: "832351365086707712",
			primary: true,
			permissions: permissions(),
		},
	});

	await db.userRole.upsert({
		where: { name: "Prospect" },
		update: {},
		create: {
			name: "Prospect",
			discordId: "903976392335691796",
			permissions: permissions(),
		},
	});

	await db.userRole.upsert({
		where: { name: "Org Member" },
		update: {},
		create: {
			name: "Org Member",
			discordId: "903741582400978965",
			primary: true,
			permissions: permissions(),
		},
	});

	await db.userRole.upsert({
		where: { name: "Developer" },
		update: {},
		create: {
			name: "Developer",
			permissions: permissions([Permission.Admin]),
		},
	});

	await db.userRole.upsert({
		where: { name: "Lieutenant" },
		update: {},
		create: {
			name: "Lieutenant",
			discordId: "1107641372481159189",
			permissions: permissions(),
		},
	});

	await db.userRole.upsert({
		where: { name: "Captain" },
		update: {},
		create: {
			name: "Captain",
			discordId: "903739455809126430",
			permissions: permissions([Permission.CreateEvents]),
		},
	});

	await db.userRole.upsert({
		where: { name: "Commander" },
		update: {},
		create: {
			name: "Commander",
			discordId: "1001943337487573003",
			permissions: permissions([Permission.CreateEvents]),
		},
	});

	await db.userRole.upsert({
		where: { name: "Director" },
		update: {},
		create: {
			name: "Director",
			discordId: "933455387846410240",
			permissions: permissions([Permission.CreateEvents]),
		},
	});

	await db.userRole.upsert({
		where: { name: "Founder" },
		update: {},
		create: {
			name: "Founder",
			discordId: "1133768910034980934",
			permissions: permissions([Permission.Admin]),
		},
	});
}
