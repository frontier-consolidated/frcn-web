import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    if (!locals.user) error(401, {
        message: "Must be authenticated to view this page"
    });

    return {};
}) satisfies PageServerLoad;