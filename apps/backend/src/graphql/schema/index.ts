import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLSchema } from "graphql";
import { constraintDirectiveTypeDefsGql } from "graphql-constraint-directive/apollo4";

import { directives } from "./directives";
import { resolvers } from "./resolvers";

function applyDirectives(schema: GraphQLSchema) {
	return directives.reduce((newSchema, directive) => directive(newSchema), schema);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const typeDefs = fs.readFileSync(path.join(__dirname, "schema.generated.graphql"), {
	encoding: "utf-8",
});

const schema = applyDirectives(
	makeExecutableSchema({
		typeDefs: [constraintDirectiveTypeDefsGql, typeDefs],
		resolvers,
	})
);

export default schema;
