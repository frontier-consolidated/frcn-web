<script lang="ts">
	import { strings } from "@frcn/shared";
	import { Breadcrumb, BreadcrumbItem } from "flowbite-svelte";
	import { CalendarMonthSolid } from "flowbite-svelte-icons";

	import { CreatedByButton, TimeBadge, LocationBreadcrumbItem, Markdown, ViewMore } from "$lib/components";

	import type { PageData } from "./$types";

    export let data: PageData;

    let isFutureEvent = data.startAt ? new Date(data.startAt) >= new Date() : true;
	$: eventType = data.eventType ? strings.toTitleCase(data.eventType) : null;
</script>

<div class="flex flex-col gap-4">
    <div>
        <h1 class="text-2xl font-semibold dark:text-white">
            {data.name ? data.name : "New Event"}
        </h1>
        <CreatedByButton class="mt-1" user={data.owner} />
    </div>
    <Breadcrumb
        ariaLabel="Event Type and Location"
        olClass="inline-flex flex-wrap items-center space-x-1 md:space-x-3 rtl:space-x-reverse"
    >
        {#if eventType}
            <BreadcrumbItem home>
                <svelte:fragment slot="icon">
                    <CalendarMonthSolid class="w-4 h-4 me-2" tabindex="-1" />
                </svelte:fragment>
                {eventType} Event
            </BreadcrumbItem>
        {/if}
        {#if data.location}
            {#if data.location.length > 0}
                {#each data.location as item}
                    <LocationBreadcrumbItem location={item} />
                {/each}
            {:else}
                <BreadcrumbItem>Anywhere</BreadcrumbItem>
            {/if}
        {:else}
            <BreadcrumbItem>???</BreadcrumbItem>
        {/if}
    </Breadcrumb>
    <div class="flex flex-wrap gap-4">
        <span class="text-sm font-semibold dark:text-gray-400">
            {#if data.startAt}
                {#key data.startAt}
                    {isFutureEvent ? "Starts" : "Started"}: <TimeBadge
                        id="event-start-badge"
                        format="datetime-relative"
                        value={data.startAt}
                    />
                {/key}
            {/if}
        </span>
        <span class="text-sm font-semibold dark:text-gray-400">
            {#if data.duration}
                {#key data.duration}
                    Duration: <TimeBadge
                        id="event-duration-badge"
                        format="duration"
                        value={data.duration}
                    />
                {/key}
            {/if}
        </span>
    </div>
    {#if data.imageUrl}
        <img src={data.imageUrl} alt="{data.name} thumbnail" class="rounded-lg max-w-[40rem]" />
    {/if}
    <div class="max-w-[60rem]">
        <h2 class="text-lg font-semibold dark:text-white mt-4">Details</h2>
        <ViewMore>
            <Markdown
                class={data.description ? "dark:text-gray-400" : "dark:text-gray-600"}
                source={data.description ? data.description : "No Description"}
            />
        </ViewMore>
    </div>
</div>