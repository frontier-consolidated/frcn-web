import { browser } from "$app/environment";
import { getLocations } from "@frcn/shared/locations";

import { Queries, apollo } from "$lib/graphql";
import { pushNotification } from "$lib/stores/NotificationStore";

import type { PageLoad } from "./$types";


export const load = (async () => {
    try {
        const { data } = await apollo.query({
            query: Queries.GET_EVENTS,
        });
    
        const events = (data.events?.items ?? []).map(event => ({
            ...event,
            location: event.location ? getLocations(event.location) : null
        }))
    
        return {
            events,
            page: data.events?.page ?? 0,
            nextPage: data.events?.nextPage,
            prevPage: data.events?.prevPage,
            total: data.events?.total ?? 0
        };
    } catch (err) {
        if (browser) {
            pushNotification({
                type: "error",
                message: "Error connecting to server"
            })
        }

        return {
            events: [],
            page: 0,
            nextPage: null,
            prevPage: null,
            total: 0
        }
    }
}) satisfies PageLoad;
