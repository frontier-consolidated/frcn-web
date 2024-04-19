import { Permission, hasOwnedObjectPermission } from "@frcn/shared";
import { error } from "@sveltejs/kit";

import { Queries } from "$lib/graphql";

import type { PageServerLoad } from "./$types";

export const load = (async ({ params, locals, depends }) => {
    depends("app:currentevent");

    const { data: eventData } = await locals.apollo.query({
		query: Queries.GET_EVENT,
		variables: {
			eventId: params.eventid,
        },
	});

	if (!eventData.event) {
		error(404, "Event not found");
	}
    
    const canEdit = hasOwnedObjectPermission({
        user: locals.user,
        owner: eventData.event.owner,
        required: Permission.CreateEvents,
        override: Permission.ManageEvents
    });

    if (canEdit) {
        const { data: eventSettingsData, errors } = await locals.apollo.query({
            query: Queries.GET_EVENT_SETTINGS,
            variables: {
                eventId: eventData.event.id,
                guildId: eventData.event.channel?.discordGuild.id
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
            canEdit,
            options: {
                channels: eventSettingsData.eventChannels.filter(channel => channel.discord.sendMessages),
                emojis: eventSettingsData.customEmojis,
                discordRoles: eventSettingsData.discordRoles
            },
        };
    }

	return {
		...eventData.event,
		canEdit,
	};
}) satisfies PageServerLoad;