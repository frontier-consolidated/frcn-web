import { Permission, hasPermission } from '@frcn/shared';
import { getLocations } from '@frcn/shared/locations';
import { error } from '@sveltejs/kit';

import { Queries, apollo } from '$lib/graphql';
import type { DiscordChannel } from '$lib/graphql/__generated__/graphql';

import type { PageServerLoad } from './$types';


const editingEnabled = true

export const load = (async ({ params, locals }) => {
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
    
    const canEdit = editingEnabled && locals.user && (locals.user.id === eventData.event.owner.id || hasPermission(locals.user.permissions, Permission.CreateEvents))

    if (canEdit) {
        const { data: eventSettingsData, errors } = await apollo.query({
            query: Queries.GET_EVENT_SETTINGS,
            variables: {
                eventId: eventData.event.id,
            },
            context: {
                headers: {
                    cookie: locals.user!.cookie
                }
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
            canEdit,
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
		canEdit,
	};
}) satisfies PageServerLoad;