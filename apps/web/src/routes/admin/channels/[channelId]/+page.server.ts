import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load = (async ({ parent, params }) => {
    const { channels, options } = await parent();
    const channel = channels.find(channel => channel.id.toString() === params.channelId);

    if (!channel) error(404, "Event channel not found");

    return {
        channel,
        options
    };
}) satisfies PageServerLoad;