import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";
import { getEvents } from "./helpers";

export const load = (async ({ locals, url, depends }) => {
    depends("app:events");

    if (!locals.user) error(401, {
        message: "Must be authenticated to view this page"
    });

    return await getEvents(locals.apollo, url);
}) satisfies PageServerLoad;