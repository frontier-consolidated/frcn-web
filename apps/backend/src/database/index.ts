// eslint-disable-next-line import/default
import PrismaClientPkg from "@prisma/client";
import type { ITXClientDenyList } from "@prisma/client/runtime/library";

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

prisma.$on("query", event => {
	logger.log(`[DATABASE] Query to ${event.target} that took ${event.duration}ms`, { query: event.query, params: event.params });
});

prisma.$on("error", event => {
	logger.error("[DATABASE] Database Error", event);
});

const database = prisma;

export type Transaction = Omit<typeof database, ITXClientDenyList>;

export async function seedDatabase() {
	logger.info("Seeding database...");
	await seed(database);
	logger.info("Seeding database completed");
}

export { database };