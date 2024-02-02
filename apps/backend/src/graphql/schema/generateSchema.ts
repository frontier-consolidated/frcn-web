import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

function generatePagedTypes(typeDefs: string) {
	let extTypeDefs = typeDefs;
	const seen: string[] = [];

	const pagedTypes = typeDefs.matchAll(/Paged(?<type>[A-Za-z]+)/g);
	for (const match of pagedTypes) {
		if (seen.includes(match[0])) continue;
		seen.push(match[0]);

		const type = match.groups?.type;
		if (!type) continue;
		
		extTypeDefs += `
type ${match[0]} {
    items: [${type}!]!
	itemsPerPage: Int!
    page: Int!
    total: Int!
    nextPage: Int
	prevPage: Int
}`;
	}

	return extTypeDefs;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputTypeDefs = fs.readFileSync(path.join(__dirname, "schema.graphql"), {
	encoding: "utf-8",
});

const typeDefs = generatePagedTypes(inputTypeDefs + "\n# GENERATED TYPES:\n");

fs.writeFileSync(path.join(__dirname, "schema.generated.graphql"), typeDefs, {
	encoding: "utf-8",
});
