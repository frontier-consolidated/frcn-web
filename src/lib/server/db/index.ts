import "./load-dotenv";

import { wrapDrizzle, type InlineTransaction } from "@l3dev/drizzle-helpers";
import { drizzle } from "drizzle-orm/node-postgres";

import { building } from "$app/environment";
import { env } from "$env/dynamic/private";

import * as schema from "./schema";

export * from "./schema";

export type DbInlineTransaction = InlineTransaction<typeof schema>;

const DATABASE_URL = building ? process.env.DATABASE_URL : env.DATABASE_URL;

export const db = wrapDrizzle(
	drizzle(DATABASE_URL!, {
		schema
	})
);
