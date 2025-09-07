import { Permission, hasPermission } from "@frcn/shared";
import { error } from "@sveltejs/kit";

import { Queries } from "$lib/graphql";

import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals, depends }) => {
	depends("app:eventchannels");

	if (!locals.user || !hasPermission(locals.user.permissions, Permission.ManageSystem)) {
		error(403, "Missing permission");
	}

	const { data } = await locals.apollo.query({
		query: Queries.GET_ALL_EVENT_CHANNELS
	});

	return {
		...data.settings,
		channels: data.eventChannels,
		defaultGuild: data.settings.discordGuild,
		options: {
			guilds: data.discordGuilds,
			channels: data.discordChannels,
			voiceChannels: data.discordVoiceChannels,
			categories: data.discordCategories
		}
	};
}) satisfies LayoutServerLoad;
