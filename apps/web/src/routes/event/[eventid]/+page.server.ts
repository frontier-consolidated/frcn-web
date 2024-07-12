import { Permission, hasOwnedObjectPermission } from "@frcn/shared";
import { error } from "@sveltejs/kit";

import { Queries } from "$lib/graphql";

import type { PageServerLoad } from "./$types";

export const load = (async ({ params, locals, depends }) => {
    depends("app:currentevent");

    const { data: event_data } = await locals.apollo.query({
		query: Queries.GET_EVENT,
		variables: {
			eventId: params.eventid,
        },
	});

	if (!event_data.event) {
		error(404, "Event not found");
	}
    
    const can_edit = hasOwnedObjectPermission({
        user: locals.user,
        owner: event_data.event.owner,
        required: Permission.CreateEvents,
        override: Permission.ManageEvents
    });

    if (can_edit) {
        const { data: event_settings_data, errors } = await locals.apollo.query({
            query: Queries.GET_EVENT_SETTINGS,
            variables: {
                eventId: event_data.event.id,
                guildId: event_data.event.channel?.discordGuild.id
            },
            errorPolicy: "all",
        });

        if (!event_settings_data) {
            console.error(errors);
            throw new Error("MISSING DATA");
        }

        return {
            ...event_data.event,
            ...event_settings_data.event,
            canEdit: can_edit,
            options: {
                channels: event_settings_data.eventChannels.filter(channel => channel.discord.sendMessages),
                emojis: event_settings_data.customEmojis,
                discordRoles: event_settings_data.discordRoles
            },
        };
    }

	return {
		...event_data.event,
		canEdit: can_edit,
	};
}) satisfies PageServerLoad;