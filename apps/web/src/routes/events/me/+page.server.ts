import { Permission, hasOneOfPermissions } from "@frcn/shared";
import { getLocations } from "@frcn/shared/locations";
import { redirect } from "@sveltejs/kit";

import { Queries } from "$lib/graphql";

import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, url, depends }) => {
	depends("app:my-events");

	if (
		!locals.user ||
		!hasOneOfPermissions(locals.user.permissions, [
			Permission.CreateEvents,
			Permission.ManageEvents
		])
	)
		redirect(307, "/events");

	const { data } = await locals.apollo.query({
		query: Queries.GET_OWNED_EVENTS
	});

	const query = url.searchParams.get("q");
	const events = data.events?.events
		? data.events.events.filter((event) =>
				query ? event.name.toLowerCase().includes(query.toLowerCase()) : true
			)
		: [];
	const eventsWithLocations = events.map((event) => ({
		...event,
		location: event.location ? getLocations(event.location) : null
	}));

	return {
		events: eventsWithLocations
	};
}) satisfies PageServerLoad;
