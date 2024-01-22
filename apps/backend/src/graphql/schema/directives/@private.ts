import { GraphQLSchema, defaultFieldResolver } from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { Context } from "../../context";

const directiveName = "private";

interface DirectiveArgs {}

export default function directive(schema: GraphQLSchema) {
	return mapSchema(schema, {
		[MapperKind.OBJECT_FIELD]: (fieldConfig) => {
			const args = getDirective(schema, fieldConfig, directiveName)?.[0] as
				| DirectiveArgs
				| undefined;
			if (!args) return fieldConfig;

			let { resolve: originalResolver } = fieldConfig;
			originalResolver ??= defaultFieldResolver;

			fieldConfig.resolve = function (source, args, context: Context, info) {
				return originalResolver(source, args, context, info);
			};

			return fieldConfig;
		},
	});
}
