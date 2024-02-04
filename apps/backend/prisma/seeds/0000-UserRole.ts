import { Permission, permissions } from "@frcn/shared";
import type { PrismaClient } from "@prisma/client";

export async function seed(db: PrismaClient) {
	await db.userRole.upsert({
		where: { id: "5ea9732c-7604-4c01-9ac9-303d4f4fa2f9" },
		update: {},
		create: {
			id: "5ea9732c-7604-4c01-9ac9-303d4f4fa2f9",
			name: "Developer",
			primary: true,
			permissions: permissions([Permission.Admin]),
		},
	});
}
