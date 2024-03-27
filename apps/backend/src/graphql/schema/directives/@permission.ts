import { Permission, hasAllOfPermissions, hasOneOfPermissions, hasPermission } from "@frcn/shared";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { GraphQLSchema, defaultFieldResolver } from "graphql";

import type { GQLContext } from "../../context";
import { calculatePermissions } from "../calculatePermissions";
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

			const { resolve: originalResolver } = fieldConfig;

			fieldConfig.resolve = async function (source, args, context: GQLContext, info) {
				if (!context.user && !context.accesskey) throw gqlErrorUnauthenticated();

				const permissions = await calculatePermissions(context)

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

				return (originalResolver ?? defaultFieldResolver)(source, args, context, info);
			};

			return fieldConfig;
		},
	});
}
