import type { PageServerLoad } from "./$types";
import { get_resources } from "./helpers";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const load = (async ({ locals, url, depends, setHeaders }) => {
    depends("app:resources");
    
    return await get_resources(locals.apollo, url, setHeaders);
}) satisfies PageServerLoad;