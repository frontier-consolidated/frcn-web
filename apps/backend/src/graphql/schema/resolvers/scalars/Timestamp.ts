import type { Timestamp } from "@frcn/graphql-scalar-types/server";
import { GraphQLError, GraphQLScalarType, Kind } from "graphql";

export const TimestampScalar = new GraphQLScalarType<Date, number>({
	name: "Timestamp",
	description: "An epoch unix timestamp in milliseconds, such as 1695569514000.",
	extensions: {
		codegenScalarType: "number",
		jsonSchema: {
			type: "number",
		},
	},
	serialize(value: Timestamp["output"]) {
		if (value instanceof Date) {
			const time = value.getTime();
			if (time === time) {
				return value.getTime();
			}
			throw new GraphQLError("Timestamp cannot represent an invalid Date instance");
		} else if (typeof value === "number") {
			if (value % 1 === 0) {
				return value;
			}
			throw new GraphQLError(
				`Timestamp cannot represent an invalid epoch unix timestamp ${value}.`
			);
		} else {
			throw new GraphQLError(
				"Timestamp cannot represent a non integer, or non Date type " +
					JSON.stringify(value)
			);
		}
	},
	parseValue(value: Timestamp["input"]) {
		if (typeof value === "number") {
			if (value % 1 === 0) {
				return new Date(value);
			}
			throw new GraphQLError(
				`Timestamp cannot represent an invalid epoch unix timestamp ${value}.`
			);
		}
		throw new GraphQLError(
			`Timestamp cannot represent non integer type ${JSON.stringify(value)}`
		);
	},
	parseLiteral(ast) {
		if (ast.kind !== Kind.INT) {
			throw new GraphQLError(
				`Timestamp cannot represent non integer type ${"value" in ast && ast.value}`,
				{
					nodes: ast,
				}
			);
		}
		return new Date(parseInt(ast.value, 10));
	},
});
