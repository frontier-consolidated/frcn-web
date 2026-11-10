import { Permission } from "@frcn/shared";
import { createGraphQLError } from "@graphql-tools/utils";
import type { PermissionResolvable } from "discord.js";
import type { GraphQLErrorOptions } from "graphql";

type GraphQLErrorType =
	| "NOT_FOUND"
	| "UNAUTHENTICATED"
	| "MISSING_PERMISSION"
	| "BOT_MISSING_PERMISSION"
	| "NOT_OWNED"
	| "BAD_USER_INPUT"
	| "BAD_STATE";

export function gqlError(type: GraphQLErrorType, message: string, options?: GraphQLErrorOptions) {
	return createGraphQLError(message, {
		...options,
		extensions: {
			code: type,
			...options?.extensions
		}
	});
}

export function gqlErrorNotFound(
	message: string,
	extensions: Record<string, unknown>,
	originalError?: Error
) {
	return gqlError("NOT_FOUND", message, {
		extensions,
		originalError
	});
}

export function gqlErrorUnauthenticated() {
	return gqlError("UNAUTHENTICATED", "Must be authenticated");
}

export function gqlErrorOwnership() {
	return gqlError("NOT_OWNED", "Must own this object");
}

type PermissionErrorExtension =
	| keyof typeof Permission
	| {
			oneOf: (keyof typeof Permission)[];
	  }
	| {
			allOf: (keyof typeof Permission)[];
	  };

export function gqlErrorPermission(permission: PermissionErrorExtension, message?: string) {
	return gqlError("MISSING_PERMISSION", "Missing permission", {
		extensions: {
			missingPermission: permission
		}
	});
}

export function gqlErrorBotPermission(permissions: PermissionResolvable[], message?: string) {
	return gqlError(
		"BOT_MISSING_PERMISSION",
		"Bot missing permission" + (message ? `: ${message}` : ""),
		{
			extensions: {
				missingPermissions: permissions
			}
		}
	);
}

export function gqlErrorBadInput(message: string) {
	return gqlError("BAD_USER_INPUT", message);
}

export function gqlErrorBadState(message: string) {
	return gqlError("BAD_STATE", message);
}
