import { error } from "@sveltejs/kit";

import { Queries } from "$lib/graphql";

import type { PageServerLoad } from "./$types";

export const load = (async ({ parent, params, locals }) => {
	const { channels, options: defaultOptions, defaultGuild } = await parent();

	const channel = channels.find((channel) => channel.id.toString() === params.channelId);
	if (!channel) error(404, "Event channel not found");

	if (channel.discordGuild.id === defaultGuild.id) {
		return {
			channel,
			options: defaultOptions
		};
	}

	const { data } = await locals.apollo.query({
		query: Queries.GET_EVENT_CHANNEL_OPTIONS,
		variables: {
			guildId: channel.discordGuild.id
		}
	});

	return {
		channel,
		options: {
			guilds: defaultOptions.guilds,
			channels: data.discordChannels,
			voiceChannels: data.discordVoiceChannels,
			categories: data.discordCategories
		}
	};
}) satisfies PageServerLoad;
