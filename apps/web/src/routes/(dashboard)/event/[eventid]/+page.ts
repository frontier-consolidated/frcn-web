import { getLocations } from "@frcn/shared/locations";
import { error } from "@sveltejs/kit";
import { get } from "svelte/store";

import { Queries, apollo } from "$lib/graphql";
import type { DiscordChannel } from "$lib/graphql/__generated__/graphql";
import { user, waitTillUserLoaded } from "$lib/stores/UserStore";

import type { PageLoad } from "./$types";


export const load = (async ({ params }) => {
	const { data: eventData } = await apollo.query({
		query: Queries.GET_EVENT,
		variables: {
			eventId: params.eventid,
		},
	});

	if (!eventData.event) {
		error(404, "Event not found");
	}

	const location = eventData.event.location ? getLocations(eventData.event.location) : null;

	await waitTillUserLoaded();
	const currentUser = get(user);
	if (currentUser.data && currentUser.data.id == eventData.event.owner?.id) {
		const { data: eventSettingsData, errors } = await apollo.query({
			query: Queries.GET_EVENT_SETTINGS,
			variables: {
				eventId: eventData.event.id,
			},
			errorPolicy: "all",
		});

		if (!eventSettingsData) {
			console.error(errors);
			throw new Error("MISSING DATA");
		}

		return {
			...eventData.event,
			...eventSettingsData.event,
			location,
			canEdit: true,
			options: {
				channels: eventSettingsData.eventChannels.filter((channel): channel is DiscordChannel => !!channel),
				emojis: eventSettingsData.customEmojis,
				discordRoles: eventSettingsData.discordRoles
			},
		};
	}

	return {
		...eventData.event,
		location,
		canEdit: false,
	};
}) satisfies PageLoad;
