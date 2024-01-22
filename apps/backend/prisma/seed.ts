import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new PrismaClient();

async function main() {
	const files = fs.readdirSync(path.join(__dirname, "seeds"), {
		withFileTypes: true,
	});
	for (const file of files) {
		if (!file.isFile()) continue;

		const { seed } = (await import(path.join(file.path, file.name))) as {
			seed: (db: PrismaClient) => void | Promise<void>;
		};
		await Promise.resolve(seed(db));
	}
}

main()
	.then(async () => {
		await db.$disconnect();
	})
	.catch(async (err) => {
		console.error(err);
		await db.$disconnect();
		process.exit(1);
	});
