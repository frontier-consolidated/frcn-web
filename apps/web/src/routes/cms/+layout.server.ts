import { Permission, hasAllOfPermissions } from "@frcn/shared";
import { redirect } from "@sveltejs/kit";

import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals }) => {
	if (
		!locals.user ||
		!hasAllOfPermissions(locals.user.permissions, [Permission.CmsRead, Permission.CmsWrite])
	) {
		redirect(307, "/");
	}
}) satisfies LayoutServerLoad;
