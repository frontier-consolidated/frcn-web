import { PrismaClient } from "@prisma/client";
import type { ITXClientDenyList } from "@prisma/client/runtime/library";

import { logger } from "./utils/logger";

const client = new PrismaClient({
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

client.$on("error", (event) => {
	logger.error("[DATABASE] Database Error", event);
});

export const database = client;
export type Transaction = Omit<typeof database, ITXClientDenyList>;
