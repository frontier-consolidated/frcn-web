import { goto } from "$app/navigation";
import { dates } from "@frcn/shared";
import { getLocations } from "@frcn/shared/locations";

import { Queries, getApollo, type TypedApolloClient, Mutations } from "$lib/graphql";
import type { GetEventsQueryVariables } from "$lib/graphql/__generated__/graphql";
import { getPageVars } from "$lib/pageHelpers";
import { pushNotification } from "$lib/stores/NotificationStore";

function getCalendarDate(relative: Date, index: number) {
    const previousMonth = dates.getPreviousMonth(relative);
    const daysInMonth = dates.getDaysInMonth(relative);
    const daysInPreviousMonth = dates.getDaysInMonth(previousMonth);
    
    const relativeDay = index - relative.getDay();
    const day =
        (relativeDay < 0 ? daysInPreviousMonth + relativeDay : relativeDay % daysInMonth) +
        1;
    const monthShift = relativeDay < 0 ? -1 : Math.floor(relativeDay / daysInMonth);
    let year = relative.getFullYear();
    let month = relative.getMonth() + monthShift;
    if (month > 11) {
        month -= 12;
        year++;
    } else if (month < 0) {
        month += 12;
        year--;
    }

    return new Date(year, month, day);
}

export async function getEvents(apollo: TypedApolloClient, url: URL) {
    let variables: GetEventsQueryVariables;

    const view = url.searchParams.get("view");
    const monthTimestamp = Number(url.searchParams.get("month"));

    if (view === "calendar") {
        const initDate = new Date(isNaN(monthTimestamp) ? Date.now() : monthTimestamp);
        const date = new Date(initDate.getFullYear(), initDate.getMonth());

        variables = {
            filter: {
                search: url.searchParams.get("q"),
                includeCompleted: true,
                minStartAt: getCalendarDate(date, 0).getTime(),
                maxStartAt: getCalendarDate(date, dates.daysPerMonth).getTime(),
            }
        };
    } else {
        const { page, limit } = getPageVars(url.searchParams);
        const includeCompleted = url.searchParams.has("includecompleted");
        
        variables = {
            filter: {
                search: url.searchParams.get("q"),
                includeCompleted
            },
            page,
            limit
        };
    }

    const eventType = url.searchParams.get("type");
    if (eventType) {
        variables.filter ??= {};
        variables.filter.eventType = eventType;
    }

    const { data } = await apollo.query({
        query: Queries.GET_EVENTS,
        variables
    });

    const events = (data.events?.items ?? []).map(event => ({
        ...event,
        location: event.location ? getLocations(event.location) : null
    }));

    return {
        events,
        itemsPerPage: data.events?.itemsPerPage ?? 1,
        page: data.events?.page ?? 0,
        nextPage: data.events?.nextPage,
        prevPage: data.events?.prevPage,
        total: data.events?.total ?? 0
    };
}

export async function createEvent(startAt?: Date) {
    try {
        // rounded to next hour
        if (startAt) {
            const hourMs = 60 * 60 * 1000;
            startAt = new Date(Math.ceil(startAt.getTime() / hourMs) * hourMs);
        }

        const { data: createData } = await getApollo().mutate({
            mutation: Mutations.CREATE_EVENT,
            variables: {
                startAt: startAt ? startAt.getTime() : undefined
            }
        });

        if (createData && createData.event) {
            goto(`/event/${createData.event}`);
        }
    } catch (err) {
        pushNotification({
            type: "error",
            message: "Failed to create event"
        });
        console.error(err);
    }
}