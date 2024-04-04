<script lang="ts">
	import { Permission, dates, hasPermission } from "@frcn/shared";
	import { Button, Heading, Indicator, Timeline, TimelineItem } from "flowbite-svelte";
	import { ArrowLeftSolid, ArrowRightSolid, CirclePlusSolid } from "flowbite-svelte-icons";
	import { type Writable } from 'svelte/store';
    import { locale } from "svelte-i18n";
	import { queryParam } from "sveltekit-search-params";
	import { twMerge } from 'tailwind-merge';

	import { TimeBadge } from "$lib/components";
	import ScreenQuery from "$lib/components/utils/ScreenQuery.svelte";
	import { user } from "$lib/stores/UserStore";

    import type { PageData } from "./$types";
	import CreateEventButton from "./CreateEventButton.svelte";
	import EventCard from "./EventCard.svelte";
	import { createEvent } from "./helpers";


    function getDefaultViewMonth() {
        const now = new Date()
        return new Date(now.getFullYear(), now.getMonth())
    }

    function getToday() {
        const today = new Date();
		today.setHours(0, 0, 0, 0);
        return today;
    }

    function getEventStartAt(date: Date) {
        if (date >= getToday() && date < new Date()) {
            return new Date()
        }
        const startAt = new Date(date)
        startAt.setHours(12, 0, 0, 0)
        return startAt
    }

    const viewMonth = queryParam("month", {
        decode(value) {
            if (!value) return getDefaultViewMonth();
            const timestamp = Number(value)
            if (isNaN(timestamp)) return getDefaultViewMonth();
            return new Date(timestamp)
        },
        encode(value) {
            return value.getTime().toString()
        },
        defaultValue: getDefaultViewMonth()
    }) as Writable<Date>

    const selectedDate = queryParam("selectedDate", {
        decode(value) {
            if (!value) return null;
            const timestamp = Number(value)
            if (isNaN(timestamp)) return null;
            return new Date(timestamp)
        },
        encode(value) {
            return value.getTime().toString()
        },
    })

	export let data: PageData;

    
	let days: { date: Date, events: PageData["events"] }[] = [];
	$: {
        const viewDate = $viewMonth ?? new Date()
		const previousMonth = dates.getPreviousMonth(viewDate);
		const daysInMonth = dates.getDaysInMonth(viewDate);
		const daysInPreviousMonth = dates.getDaysInMonth(previousMonth);

		const firstDay = viewDate.getDay();

		days = [];
		for (let i = 0; i < dates.daysPerMonth; i++) {
			const relativeDay = i - firstDay;
			const day =
				(relativeDay < 0 ? daysInPreviousMonth + relativeDay : relativeDay % daysInMonth) +
				1;
			const monthShift = relativeDay < 0 ? -1 : Math.floor(relativeDay / daysInMonth);
			let year = viewDate.getFullYear();
			let month = viewDate.getMonth() + monthShift;
			if (month > 11) {
				month -= 12;
				year++;
			} else if (month < 0) {
				month += 12;
				year--;
			}

            const date = new Date(year, month, day)
            const nextDate = new Date(year, month, day + 1)
			days.push({
                date,
                events: data.events.filter(event => event.startAt && new Date(event.startAt) >= date && new Date(event.startAt) < nextDate)
            });
		}
	}
</script>

<div class="flex flex-col gap-2">
    <div class="flex gap-2">
        <Button
            class="min-[400px]:ml-auto dark:bg-gray-700 dark:hover:bg-gray-600 py-2"
            on:click={() => {
                viewMonth.set(getDefaultViewMonth())
            }}
        >
            Today
        </Button>
        <div class="flex-1 min-[500px]:flex-none flex gap-2 justify-between items-center">
            <Button
                class="dark:bg-gray-700 dark:hover:bg-gray-600 p-3 aspect-square"
                on:click={() => {
                    viewMonth.set(dates.getPreviousMonth($viewMonth))
                }}
            >
                <ArrowLeftSolid size="xs" tabindex="-1" />
            </Button>
            <span class="flex-1 text-center font-medium text-black dark:text-white min-[400px]:min-w-[150px]">
                {new Intl.DateTimeFormat($locale ?? "en", {
					month: "long",
					year: "numeric",
				}).format($viewMonth)}
            </span>
            <Button
                class="dark:bg-gray-700 dark:hover:bg-gray-600 p-3 aspect-square"
                on:click={() => {
                    viewMonth.set(dates.getNextMonth($viewMonth))
                }}
            >
                <ArrowRightSolid size="xs" tabindex="-1" />
            </Button>
        </div>
    </div>
    <ScreenQuery size="md" let:matches>
        <div class="grid grid-cols-7 text-black dark:text-white text-xs sm:text-sm md:text-base">
            {#each days as day, i}
                {@const topRow = i < 7}
                {@const inPast = day.date < getToday()}
                {@const selected = dates.isSelected($selectedDate, day.date)}
                {@const disabled = inPast || !dates.isCurrentMonth($viewMonth, day.date)}
                {@const canCreateEvents = !inPast && hasPermission($user.data?.permissions ?? 0, Permission.CreateEvents)}
                <button
                    class={twMerge("w-full aspect-square md:aspect-auto min-h-[64px] h-none md:h-32 lg:h-40 flex flex-col items-center bg-zinc-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 border-l border-b cursor-default", disabled && "text-gray-500", topRow && "border-t", (i + 1) % 7 === 0 && "border-r", i === 0 && "rounded-tl", i === 6 && "rounded-tr", i === dates.daysPerMonth - 7 && "rounded-bl", i === dates.daysPerMonth - 1 && "rounded-br", !matches && "cursor-pointer", (!matches && selected) && "bg-slate-200 dark:bg-gray-700")}
                    on:click={() => {
                        selectedDate.set(day.date)
                    }}
                >
                    <button
                        class={twMerge("group/date relative w-full py-1 sm:py-2 flex flex-col items-center", matches && "cursor-default", (matches && canCreateEvents) && "hover:bg-zinc-200 dark:hover:bg-gray-700 cursor-pointer")}
                        on:click={async (e) => {
                            if (!matches || !canCreateEvents) return;
                            e.stopPropagation()
                            await createEvent(getEventStartAt(day.date))
                        }}
                    >
                        {#if topRow}
                            <span>
                                {new Intl.DateTimeFormat($locale ?? "en", {
                                    weekday: "short",
                                })
                                    .format(day.date)
                                    .slice(0, 2)}
                            </span>
                        {/if}
                        <span class={twMerge("block rounded px-3 font-medium", dates.isToday(day.date) && "bg-primary-500 text-white dark:bg-primary-600")}>{day.date.getDate()}</span>
                        {#if matches && canCreateEvents}
                            <CirclePlusSolid class="absolute top-1 right-1 text-primary-500 dark:text-gray-200 hidden group-hover/date:block" size="sm" />
                        {/if}
                    </button>
                    {#if day.events.length > 0}
                        {#if matches}
                            <div class="w-full px-1 flex flex-col gap-px items-stretch">
                                {#each day.events as event}
                                    {@const eventStart = event.startAt && new Date(event.startAt)}
                                    <Button href="/event/{event.id}" target="_blank" disabled={eventStart && eventStart < new Date()} color="dark" class="flex justify-start gap-1 text-left rounded p-px pl-0" size="xs" on:click={(e) => {
                                        e.stopPropagation()
                                    }}>
                                        <div class="rounded-l h-full w-1 bg-primary-500"></div>
                                        <span class="flex-1 truncate">
                                            {event.name}
                                        </span>
                                        {#if eventStart}
                                            <span class="shrink-0 font-normal text-gray-300">
                                                {new Intl.DateTimeFormat($locale ?? "en", {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })
                                                    .format(eventStart)}
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
        {#if !matches && $selectedDate}
            {@const selectedEvents = days.find(day => day.date.getTime() === $selectedDate?.getTime())?.events ?? []}
            <section class="flex flex-col items-stretch gap-2">
                <Heading tag="h2" class="text-xl">Events for {new Intl.DateTimeFormat($locale ?? "en", {
                    dateStyle: "long",
                }).format($selectedDate)}</Heading>
                <CreateEventButton startAt={getEventStartAt($selectedDate)} />
                <Timeline class="w-full">
                    {#each selectedEvents as event}
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
