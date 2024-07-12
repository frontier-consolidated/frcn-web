import { goto } from "$app/navigation";
import { dates } from "@frcn/shared";
import { getLocations } from "@frcn/shared/locations";

import { Queries, get_apollo, type TypedApolloClient, Mutations } from "$lib/graphql";
import type { GetEventsQueryVariables } from "$lib/graphql/__generated__/graphql";
import { get_page_vars } from "$lib/pageHelpers";
import { push_notification } from "$lib/stores/NotificationStore";

function get_calendar_date(relative: Date, index: number) {
    const previous_month = dates.getPreviousMonth(relative);
    const days_in_month = dates.getDaysInMonth(relative);
    const days_in_previous_month = dates.getDaysInMonth(previous_month);
    
    const relative_day = index - relative.getDay();
    const day =
        (relative_day < 0 ? days_in_previous_month + relative_day : relative_day % days_in_month) +
        1;
    const month_shift = relative_day < 0 ? -1 : Math.floor(relative_day / days_in_month);
    let year = relative.getFullYear();
    let month = relative.getMonth() + month_shift;
    if (month > 11) {
        month -= 12;
        year++;
    } else if (month < 0) {
        month += 12;
        year--;
    }

    return new Date(year, month, day);
}

export async function get_events(apollo: TypedApolloClient, url: URL) {
    let variables: GetEventsQueryVariables;

    const view = url.searchParams.get("view");

    if (view === "calendar") {
        const init_date = new Date(url.searchParams.get("month") ?? Date.now());
        const date = new Date(init_date.getFullYear(), init_date.getMonth());

        variables = {
            filter: {
                search: url.searchParams.get("q"),
                includeCompleted: true,
                minStartAt: get_calendar_date(date, 0).getTime(),
                maxStartAt: get_calendar_date(date, dates.daysPerMonth).getTime(),
            }
        };
    } else {
        const { page, limit } = get_page_vars(url.searchParams);
        const include_completed = url.searchParams.has("includecompleted");
        
        variables = {
            filter: {
                search: url.searchParams.get("q"),
                includeCompleted: include_completed
            },
            page,
            limit
        };
    }

    const event_type = url.searchParams.get("type");
    if (event_type) {
        variables.filter ??= {};
        variables.filter.eventType = event_type;
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

export async function create_event(start_at?: Date) {
    try {
        // rounded to next hour
        if (start_at) {
            const hour_ms = 60 * 60 * 1000;
            start_at = new Date(Math.ceil(start_at.getTime() / hour_ms) * hour_ms);
        }

        const { data: create_data } = await get_apollo().mutate({
            mutation: Mutations.CREATE_EVENT,
            variables: {
                startAt: start_at ? start_at.getTime() : undefined
            }
        });

        if (create_data && create_data.event) {
            goto(`/event/${create_data.event}`);
        }
    } catch (err) {
        push_notification({
            type: "error",
            message: "Failed to create event"
        });
        console.error(err);
    }
}