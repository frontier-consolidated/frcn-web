import { GraphQLError, GraphQLScalarType, Kind } from "graphql";

export const DateScalar = new GraphQLScalarType<Date, number>({
	name: "Date",
	description: "An epoch unix timestamp in milliseconds, such as 1695569514000.",
	extensions: {
		codegenScalarType: "number",
		jsonSchema: {
			type: "number",
		},
	},
	serialize(value) {
		if (value instanceof Date) {
			const time = value.getTime();
			if (time === time) {
				return value.getTime();
			}
			throw new GraphQLError("Date cannot represent an invalid Date instance");
		} else if (typeof value === "number") {
			if (value >= 0 && value % 1 === 0) {
				return value;
			}
			throw new GraphQLError(
				`Date cannot represent an invalid epoch unix timestamp ${value}.`
			);
		} else {
			throw new GraphQLError(
				"Date cannot represent a non integer, or non Date type " + JSON.stringify(value)
			);
		}
	},
	parseValue(value) {
		if (typeof value === "number") {
			if (value >= 0 && value % 1 === 0) {
				return new Date(value);
			}
			throw new GraphQLError(
				`Date cannot represent an invalid epoch unix timestamp ${value}.`
			);
		}
		throw new GraphQLError(`Date cannot represent non integer type ${JSON.stringify(value)}`);
	},
	parseLiteral(ast) {
		if (ast.kind !== Kind.INT) {
			throw new GraphQLError(
				`Date cannot represent non integer type ${"value" in ast && ast.value}`,
				{
					nodes: ast,
				}
			);
		}
		return new Date(parseInt(ast.value, 10));
	},
});
