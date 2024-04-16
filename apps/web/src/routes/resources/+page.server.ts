import type { PageServerLoad } from "./$types";
import { getResources } from "./helpers";

export const load = (async ({ locals, url, depends, setHeaders }) => {
    depends("app:resources");
    
    return await getResources(locals.apollo, url, setHeaders);
}) satisfies PageServerLoad;