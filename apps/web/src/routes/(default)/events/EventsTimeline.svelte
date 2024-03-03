<script lang="ts">
	import { goto } from "$app/navigation";
    import { page } from "$app/stores";
	import { Timeline, TimelineItem, Pagination } from "flowbite-svelte";

	import TimeBadge from "$lib/components/datetime/TimeBadge.svelte";
	import { getCurrentPage, getPageUrl, getPages } from "$lib/pageHelpers";

    import type { PageData } from "./$types";
	import EventCard from "./EventCard.svelte";

	export let data: PageData;
	
	$: currentPage = getCurrentPage($page.url.searchParams);
	$: pages = getPages($page.url, currentPage, data.itemsPerPage, data.total);
</script>

<svelte:head>
    {#each data.events as event}
        {#if event.imageUrl}
            <link rel="preload" href={event.imageUrl} as="image" />
        {/if}
    {/each}
</svelte:head>

<div class="flex flex-col items-center">
    <Timeline class="w-full">
        {#each data.events as event}
            <TimelineItem>
                <div class="mb-2">
                    <TimeBadge id="test-event-time" format="datetime-relative" value={event.startAt ?? 0} />
                </div>
                <EventCard bind:event />
            </TimelineItem>
        {/each}
    </Timeline>
    <Pagination 
        {pages}
        on:previous={() => {if (data.prevPage != null) goto(getPageUrl($page.url, data.prevPage + 1))}}
			on:next={() => {if (data.nextPage != null) goto(getPageUrl($page.url, data.nextPage + 1))}}
    />
</div>