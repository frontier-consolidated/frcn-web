import { building } from "$app/environment";
import { getCmsClient } from "$lib/server/cms";

import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load = (async ({ depends }) => {
	depends("cms:indexes");

	if (building)
		return {
			indexes: []
		};

	const indexes = await getCmsClient().getIndexes();

	return {
		indexes
	};
}) satisfies PageServerLoad;
