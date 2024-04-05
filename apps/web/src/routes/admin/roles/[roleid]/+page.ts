import type { PageLoad } from "./$types";

export const load = (async ({ parent, data }) => {
    const parentData = await parent();
    return {
        ...data,
        roles: parentData.roles
    };
}) satisfies PageLoad;