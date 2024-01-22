import { GraphQLError, GraphQLSchema, defaultFieldResolver } from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { Context } from "../../context";
import { Permission, hasOneOfPermissions } from "@frcn/shared";
import { users } from "../../../services/users";

const directiveName = "manages";

interface DirectiveArgs {}

const managePermissions = [Permission.ManageRoles, Permission.ManageSystem];

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
				if (!context.user)
					throw new GraphQLError("Must be authenticated", {
						extensions: {
							code: "UNAUTHENTICATED",
						},
					});

				const permissions = users.resolveUserPermissions(context.user);
				if (!hasOneOfPermissions(permissions, managePermissions))
					throw new GraphQLError("Missing permission", {
						extensions: {
							code: "MISSING_PERMISSION",
							missingPermission: {
								oneOf: managePermissions.map((mask) => Permission[mask]),
							},
						},
					});

				return originalResolver(source, args, context, info);
			};

			return fieldConfig;
		},
	});
}
