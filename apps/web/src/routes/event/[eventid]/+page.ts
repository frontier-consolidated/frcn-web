import { getLocations } from "@frcn/shared/locations";

import type { PageLoad } from "./$types";

export const load = (async ({ data }) => {
	const location = data.location ? getLocations(data.location) : null;
	return {
		...data,
		location
	};
}) satisfies PageLoad;
