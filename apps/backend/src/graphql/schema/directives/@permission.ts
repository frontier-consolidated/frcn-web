import { Permission, hasAllOfPermissions, hasOneOfPermissions, hasPermission } from "@frcn/shared";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { GraphQLSchema, defaultFieldResolver } from "graphql";

import { database } from "../../../database";
import { $roles } from "../../../services/roles";
import { Context } from "../../context";
import { gqlErrorPermission, gqlErrorUnauthenticated } from "../gqlError";

const directiveName = "permission";

interface DirectiveArgs {
	has?: keyof typeof Permission;
	one?: (keyof typeof Permission)[];
	all?: (keyof typeof Permission)[];
}

export default function directive(schema: GraphQLSchema) {
	return mapSchema(schema, {
		[MapperKind.OBJECT_FIELD]: (fieldConfig) => {
			const directiveArgs = getDirective(schema, fieldConfig, directiveName)?.[0] as
				| DirectiveArgs
				| undefined;
			if (!directiveArgs) return fieldConfig;

			let { resolve: originalResolver } = fieldConfig;
			originalResolver ??= defaultFieldResolver;

			fieldConfig.resolve = async function (source, args, context: Context, info) {
				if (!context.user) throw gqlErrorUnauthenticated();

				const primaryRole = await database.user.getPrimaryRole(context.user);
				const userRoles = await database.user.getRoles(context.user);
				const permissions = await $roles.resolvePermissions(primaryRole, userRoles);

				if (
					directiveArgs.has &&
					!hasPermission(permissions, Permission[directiveArgs.has])
				) {
					throw gqlErrorPermission(directiveArgs.has);
				}

				if (
					directiveArgs.one &&
					!hasOneOfPermissions(
						permissions,
						directiveArgs.one.map((k) => Permission[k])
					)
				) {
					throw gqlErrorPermission({
						oneOf: directiveArgs.one,
					});
				}

				if (
					directiveArgs.all &&
					!hasAllOfPermissions(
						permissions,
						directiveArgs.all.map((k) => Permission[k])
					)
				) {
					throw gqlErrorPermission({
						allOf: directiveArgs.all,
					});
				}

				return originalResolver(source, args, context, info);
			};

			return fieldConfig;
		},
	});
}
