import { Permission, hasPermission } from "@frcn/shared";
import { error } from "@sveltejs/kit";

import { Queries } from "$lib/graphql";
import { getPageVars } from "$lib/pageHelpers";

import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, depends, url }) => {
	depends("app:allusers");

	if (!locals.user || !hasPermission(locals.user.permissions, Permission.ManageSystem)) {
		error(403, "Missing permission");
	}

	const { page, limit } = getPageVars(url.searchParams);

	const { data } = await locals.apollo.query({
		query: Queries.GET_ALL_USERS,
		variables: {
			filter: {
				search: url.searchParams.get("q")
			},
			page,
			limit
		}
	});

	return {
		users: data.users.items,
		itemsPerPage: data.users.itemsPerPage ?? 1,
		page: data.users.page ?? 0,
		nextPage: data.users.nextPage,
		prevPage: data.users.prevPage,
		total: data.users.total ?? 0
	};
}) satisfies PageServerLoad;
