import { Permission, hasPermission } from '@frcn/shared';

import { Queries } from '$lib/graphql';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, depends }) => {
    depends("app:allroles")

    if (locals.user && hasPermission(locals.user.permissions, Permission.ManageRoles)) {
        const { data: rolesData } = await locals.apollo.query({
            query: Queries.GET_ALL_ROLES,
            fetchPolicy: "no-cache",
            errorPolicy: "all"
        })
    
        return {
            roles: rolesData?.roles ?? []
        }
    }
    return {
        roles: []
    }
}) satisfies LayoutServerLoad;