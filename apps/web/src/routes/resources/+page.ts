import { browser } from "$app/environment";
import { isRedirect } from "@sveltejs/kit";

import { getApollo } from "$lib/graphql";
import { pushNotification } from "$lib/stores/NotificationStore";

import type { PageLoad } from "./$types";
import { getResources } from "./helpers";

export const load = (async ({ url, data, setHeaders }) => {
    try {
        const { couldNotConnect, ...serverData } = data;
        if (!couldNotConnect) {
            return serverData;
        }
        return await getResources(getApollo(), url, setHeaders);
    } catch (err) {
        if (isRedirect(err)) {
            throw err;
        }

        if (browser) {
            pushNotification({
                type: "error",
                message: "Error connecting to server"
            });
        }

        return {
            resources: [],
            itemsPerPage: 1,
            page: 0,
            nextPage: null,
            prevPage: null,
            total: 0
        };
    }
}) satisfies PageLoad;