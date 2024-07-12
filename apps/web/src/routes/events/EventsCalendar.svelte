<script lang="ts">
	import { Permission, dates, hasOneOfPermissions } from "@frcn/shared";
	import { Button, Heading, Indicator, Timeline, TimelineItem } from "flowbite-svelte";
	import { ArrowLeftSolid, ArrowRightSolid, CirclePlusSolid } from "flowbite-svelte-icons";
	import { type Writable } from "svelte/store";
    import { locale } from "svelte-i18n";
	import { queryParam } from "sveltekit-search-params";
	import { twMerge } from "tailwind-merge";

	import { TimeBadge } from "$lib/components";
	import ScreenQuery from "$lib/components/utils/ScreenQuery.svelte";
	import { user } from "$lib/stores/UserStore";

    import type { PageData } from "./$types";
	import CreateEventButton from "./CreateEventButton.svelte";
	import EventCard from "./EventCard.svelte";
	import { create_event } from "./helpers";

    function to_month_string(value: Date) {
        return `${value.getFullYear()}-${(value.getMonth() + 1).toString().padStart(2, "0")}`;
    }

    function get_default_view_month() {
        const now = new Date();
        return new Date(to_month_string(now));
    }

    function get_today() {
        const today = new Date();
		today.setHours(0, 0, 0, 0);
        return today;
    }

    function get_event_start_at(date: Date) {
        if (date >= get_today() && date < new Date()) {
            return new Date();
        }
        const start_at = new Date(date);
        start_at.setHours(12, 0, 0, 0);
        return start_at;
    }

    const view_month = queryParam("month", {
        decode(value) {
            if (!value) return get_default_view_month();
            return new Date(value);
        },
        encode(value) {
            return to_month_string(value);
        },
        defaultValue: get_default_view_month()
    }) as Writable<Date>;

    const selected_date = queryParam("selectedDate", {
        decode(value) {
            if (!value) return null;
            const timestamp = Number(value);
            if (isNaN(timestamp)) return null;
            return new Date(timestamp);
        },
        encode(value) {
            return value.getTime().toString();
        },
    });

	export let data: PageData;

    
	let days: { date: Date, events: PageData["events"] }[] = [];
	$: {
        const view_date = $view_month ?? new Date();
		const previous_month = dates.getPreviousMonth(view_date);
		const days_in_month = dates.getDaysInMonth(view_date);
		const days_in_previous_month = dates.getDaysInMonth(previous_month);

		const first_day = view_date.getDay();

		days = [];
		for (let i = 0; i < dates.daysPerMonth; i++) {
			const relative_day = i - first_day;
			const day =
				(relative_day < 0 ? days_in_previous_month + relative_day : relative_day % days_in_month) +
				1;
			const month_shift = relative_day < 0 ? -1 : Math.floor(relative_day / days_in_month);
			let year = view_date.getFullYear();
			let month = view_date.getMonth() + month_shift;
			if (month > 11) {
				month -= 12;
				year++;
			} else if (month < 0) {
				month += 12;
				year--;
			}

            const date = new Date(year, month, day);
            const next_date = new Date(year, month, day + 1);
			days.push({
                date,
                events: data.events.filter(event => event.startAt && new Date(event.startAt) >= date && new Date(event.startAt) < next_date)
            });
		}
	}
</script>

<div class="flex flex-col gap-2">
    <div class="flex gap-2">
        <Button
            class="min-[400px]:ml-auto dark:bg-gray-700 dark:hover:bg-gray-600 py-2"
            on:click={() => {
                view_month.set(get_default_view_month());
            }}
        >
            Today
        </Button>
        <div class="flex-1 min-[500px]:flex-none flex gap-2 justify-between items-center">
            <Button
                class="dark:bg-gray-700 dark:hover:bg-gray-600 p-3 aspect-square"
                on:click={() => {
                    view_month.set(dates.getPreviousMonth($view_month));
                }}
            >
                <ArrowLeftSolid size="xs" tabindex="-1" />
            </Button>
            <span class="flex-1 text-center font-medium text-black dark:text-white min-[400px]:min-w-[150px]">
                {new Intl.DateTimeFormat($locale ?? "en", {
					month: "long",
					year: "numeric",
				}).format($view_month)}
            </span>
            <Button
                class="dark:bg-gray-700 dark:hover:bg-gray-600 p-3 aspect-square"
                on:click={() => {
                    view_month.set(dates.getNextMonth($view_month));
                }}
            >
                <ArrowRightSolid size="xs" tabindex="-1" />
            </Button>
        </div>
    </div>
    <ScreenQuery size="md" let:matches>
        <div class="grid grid-cols-7 text-black dark:text-white text-xs sm:text-sm md:text-base">
            {#each days as day, i}
                {@const top_row = i < 7}
                {@const in_past = day.date < get_today()}
                {@const selected = dates.isSelected($selected_date, day.date)}
                {@const disabled = in_past || !dates.isCurrentMonth($view_month, day.date)}
                {@const can_create_events = !in_past && hasOneOfPermissions($user.data?.permissions ?? 0, [Permission.CreateEvents, Permission.ManageEvents])}
                <button
                    class={twMerge("w-full aspect-square md:aspect-auto min-h-[64px] h-none md:h-32 lg:h-40 flex flex-col items-center bg-zinc-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 border-l border-b cursor-default", disabled && "text-gray-500", top_row && "border-t", (i + 1) % 7 === 0 && "border-r", i === 0 && "rounded-tl", i === 6 && "rounded-tr", i === dates.daysPerMonth - 7 && "rounded-bl", i === dates.daysPerMonth - 1 && "rounded-br", !matches && "cursor-pointer", (!matches && selected) && "bg-slate-200 dark:bg-gray-700")}
                    on:click={() => {
                        selected_date.set(day.date);
                    }}
                >
                    <button
                        class={twMerge("group/date relative w-full py-1 sm:py-2 flex flex-col items-center", matches && "cursor-default", (matches && can_create_events) && "hover:bg-zinc-200 dark:hover:bg-gray-700 cursor-pointer")}
                        on:click={async (e) => {
                            if (!matches || !can_create_events) return;
                            e.stopPropagation();
                            await create_event(get_event_start_at(day.date));
                        }}
                    >
                        {#if top_row}
                            <span>
                                {new Intl.DateTimeFormat($locale ?? "en", {
                                    weekday: "short",
                                })
                                    .format(day.date)
                                    .slice(0, 2)}
                            </span>
                        {/if}
                        <span class={twMerge("block rounded px-3 font-medium", dates.isToday(day.date) && "bg-primary-500 text-white dark:bg-primary-600")}>{day.date.getDate()}</span>
                        {#if matches && can_create_events}
                            <CirclePlusSolid class="absolute top-1 right-1 text-primary-500 dark:text-gray-200 hidden group-hover/date:block" size="sm" />
                        {/if}
                    </button>
                    {#if day.events.length > 0}
                        {#if matches}
                            <div class="w-full px-1 flex flex-col gap-px items-stretch">
                                {#each day.events as event}
                                    {@const event_start = event.startAt && new Date(event.startAt)}
                                    <Button href="/event/{event.id}" target="_blank" disabled={!!event.endedAt} color="dark" class="flex justify-start gap-1 text-left rounded p-px pl-0" size="xs" on:click={(e) => {
                                        e.stopPropagation();
                                    }}>
                                        <div class="rounded-l h-full w-1 bg-primary-500"></div>
                                        <span class="flex-1 truncate">
                                            {event.name}
                                        </span>
                                        {#if event_start}
                                            <span class="shrink-0 font-normal text-gray-300">
                                                {new Intl.DateTimeFormat($locale ?? "en", {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })
                                                    .format(event_start)}
                                            </span>
                                        {/if}
                                    </Button>
                                {/each}
                            </div>
                        {:else}
                            <Indicator color="blue" class="my-auto bg-primary-600" size="xs" />
                        {/if}
                    {/if}
                </button>
            {/each}
        </div>
        {#if !matches && $selected_date}
            {@const selected_events = days.find(day => day.date.getTime() === $selected_date?.getTime())?.events ?? []}
            <section class="flex flex-col items-stretch gap-2">
                <Heading tag="h2" class="text-xl">Events for {new Intl.DateTimeFormat($locale ?? "en", {
                    dateStyle: "long",
                }).format($selected_date)}</Heading>
                <CreateEventButton startAt={get_event_start_at($selected_date)} />
                <Timeline class="w-full">
                    {#each selected_events as event}
                        <TimelineItem>
                            <div class="mb-2">
                                <TimeBadge id="test-event-time" format="datetime-relative" value={event.startAt ?? 0} />
                            </div>
                            <EventCard bind:event />
                        </TimelineItem>
                    {/each}
                </Timeline>
            </section>
        {/if}
    </ScreenQuery>
</div>
