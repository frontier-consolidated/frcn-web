// eslint-disable-next-line import/default
import PrismaClientPkg from "@prisma/client";
import type { ITXClientDenyList } from "@prisma/client/runtime/library";

import { seed } from "./seed";
import { logger } from "../logger";

const PrismaClient = PrismaClientPkg.PrismaClient;
export const prisma = new PrismaClient();

const database = prisma;

export type Transaction = Omit<typeof database, ITXClientDenyList>;

export async function seedDatabase() {
	logger.log("Seeding database...");
	await seed(database);
	logger.log("Seeding database completed");
}

export { database };