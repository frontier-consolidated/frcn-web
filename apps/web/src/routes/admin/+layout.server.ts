import { hasOneOfPermissions } from "@frcn/shared";
import { redirect } from "@sveltejs/kit";

import admin_permissions from "$lib/data/adminPermissions";

import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    if (!locals.user || !hasOneOfPermissions(locals.user.permissions, admin_permissions)) {
        redirect(307, "/");
    }
}) satisfies LayoutServerLoad;