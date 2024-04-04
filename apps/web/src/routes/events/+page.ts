import { browser } from "$app/environment";

import { getApollo } from "$lib/graphql";
import { pushNotification } from "$lib/stores/NotificationStore";

import type { PageLoad } from "./$types";
import { getEvents } from "./helpers";


export const load = (async ({ url, data }) => {
    try {
        const { couldNotConnect, ...serverData } = data
        if (!couldNotConnect) {
            return serverData
        }
        return await getEvents(getApollo(), url)
    } catch (err) {
        if (browser) {
            console.error(err)
            pushNotification({
                type: "error",
                message: "Error connecting to server"
            })
        }

        return {
            events: [],
            itemsPerPage: 1,
            page: 0,
            nextPage: null,
            prevPage: null,
            total: 0
        }
    }
}) satisfies PageLoad;
