import type { Maybe } from "@graphql-tools/utils";
import { GraphQLScalarType, Kind, print, type ObjectValueNode, type ValueNode } from "graphql";
import type { ObjMap } from "graphql/jsutils/ObjMap";

function parseObject(typeName: string, ast: ObjectValueNode, variables: Maybe<ObjMap<unknown>>) {
	const value = Object.create(null);
	ast.fields.forEach((field) => {
	  // eslint-disable-next-line no-use-before-define
	  value[field.name.value] = parseLiteral(typeName, field.value, variables);
	});
  
	return value;
}

function parseLiteral(typeName: string, ast: ValueNode, variables: Maybe<ObjMap<unknown>>): unknown {
	switch (ast.kind) {
		case Kind.STRING:
		case Kind.BOOLEAN:
			return ast.value;
		case Kind.INT:
		case Kind.FLOAT:
			return parseFloat(ast.value);
		case Kind.OBJECT:
			return parseObject("JSON", ast, variables);
		case Kind.LIST:
			return ast.values.map((n) => parseLiteral(typeName, n, variables));
		case Kind.NULL:
			return null;
		case Kind.VARIABLE:
			return variables ? variables[ast.name.value] : undefined;
		default:
			throw new TypeError(`${typeName} cannot represent value: ${print(ast)}`);
	}
}

export const ObjectScalar = new GraphQLScalarType<unknown, unknown>({
	name: "Object",
	description: "The `Object` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).",
	specifiedByURL: "http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf",
	extensions: {
		codegenScalarType: "unknown",
		jsonSchema: {
			type: "unknown",
		},
	},
	serialize(value) {
		return value;
	},
	parseValue(value) {
		return value;
	},
	parseLiteral(ast, variables) {
		return parseLiteral('JSON', ast, variables);
	},
});
