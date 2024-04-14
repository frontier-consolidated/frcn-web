<script lang="ts">
	import { CreatedByButton, TimeBadge, Markdown, ViewMore } from "$lib/components";

	import type { PageData } from "./$types";
	import EventBreadcrumb from "../../events/EventBreadcrumb.svelte";
	import EventStateBadge from "../../events/EventStateBadge.svelte";

    export let data: PageData;

    let isFutureEvent = data.startAt ? new Date(data.startAt) >= new Date() : true;
</script>

<div class="flex flex-col gap-4">
    <div>
        <h1 class="flex items-center gap-4 text-2xl font-semibold dark:text-white">
            <EventStateBadge event={data} />
            {data.name ? data.name : "New Event"}
        </h1>
        <CreatedByButton class="mt-1" user={data.owner} />
    </div>
    <EventBreadcrumb event={data} />
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