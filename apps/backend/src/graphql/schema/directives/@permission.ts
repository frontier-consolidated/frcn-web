import { GraphQLError, GraphQLSchema, defaultFieldResolver } from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { Context } from "../../context";
import { Permission, hasPermission } from "@frcn/shared";
import { users } from "../../../services/users";

const directiveName = "permission";

interface DirectiveArgs {
	name: keyof typeof Permission;
}

export default function directive(schema: GraphQLSchema) {
	return mapSchema(schema, {
		[MapperKind.OBJECT_FIELD]: (fieldConfig) => {
			const args = getDirective(schema, fieldConfig, directiveName)?.[0] as
				| DirectiveArgs
				| undefined;
			if (!args) return fieldConfig;

			let { resolve: originalResolver } = fieldConfig;
			originalResolver ??= defaultFieldResolver;

			const permission = Permission[args.name];

			fieldConfig.resolve = function (source, args, context: Context, info) {
				if (!context.user)
					throw new GraphQLError("Must be authenticated", {
						extensions: {
							code: "UNAUTHENTICATED",
						},
					});

				const permissions = users.resolveUserPermissions(context.user);
				if (!hasPermission(permissions, permission))
					throw new GraphQLError("Missing permission", {
						extensions: {
							code: "MISSING_PERMISSION",
							missingPermission: args.name,
						},
					});

				return originalResolver(source, args, context, info);
			};

			return fieldConfig;
		},
	});
}
