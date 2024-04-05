// eslint-disable-next-line import/default
import PrismaClientPkg from "@prisma/client";
import type { ITXClientDenyList } from "@prisma/client/runtime/library";

import { seed } from "./seed";

const PrismaClient = PrismaClientPkg.PrismaClient;
export const prisma = new PrismaClient();

const database = prisma;

export type Transaction = Omit<typeof database, ITXClientDenyList>;

export async function seedDatabase() {
	console.log("Seeding database...");
	await seed(database);
	console.log("Seeding database completed");
}

export { database };