// eslint-disable-next-line import/default
import PrismaClientPkg from "../__generated__/client";
import type { ITXClientDenyList } from "../__generated__/client/runtime/library";

import { migrate } from "./migrate";
import { seed } from "./seed";
import { logger } from "../logger";

const PrismaClient = PrismaClientPkg.PrismaClient;
export const prisma = new PrismaClient({
	log: [
		{
			emit: "event",
			level: "query"
		},
		{
			emit: "event",
			level: "error"
		}
	]
});

prisma.$on("error", (event) => {
	logger.error("[DATABASE] Database Error", event);
});

const database = prisma;

export type Transaction = Omit<typeof database, ITXClientDenyList>;

export async function initDatabase() {
	logger.info("Seeding database...");
	await seed(database);
	logger.info("Seeding database completed");

	logger.info("Migrating database data...");
	await migrate(database);
	logger.info("Database data migrated");
}

export { database };
