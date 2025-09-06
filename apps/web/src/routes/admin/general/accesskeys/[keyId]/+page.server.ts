import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load = (async ({ parent, params }) => {
	const { keys } = await parent();
	const key = keys.find((k) => k.id.toString() === params.keyId);

	if (!key) error(404, "Access key not found");

	return {
		key
	};
}) satisfies PageServerLoad;
