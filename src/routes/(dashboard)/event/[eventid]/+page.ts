import { testEvents } from "$lib/data/testEvents";
import type { PageLoad } from "./$types";

export const load = (async () => {
	return testEvents[0];
}) satisfies PageLoad;
