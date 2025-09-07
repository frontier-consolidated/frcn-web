import { $users } from "../../services/users";
import type { GQLContext } from "../context";

export async function calculatePermissions(context: GQLContext) {
	if (context.user) {
		return await $users.getPermissions(context.user);
	} else if (context.accesskey) {
		return context.accesskey.permissions;
	}

	return 0;
}
