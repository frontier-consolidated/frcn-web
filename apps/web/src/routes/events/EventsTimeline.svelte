<script lang="ts">
	import { goto } from "$app/navigation";
    import { page } from "$app/stores";
	import { Timeline, TimelineItem, Pagination } from "flowbite-svelte";

	import { TimeBadge } from "$lib/components";
	import { get_current_page, get_page_url, get_pages } from "$lib/pageHelpers";

    import type { PageData } from "./$types";
	import EventCard from "./EventCard.svelte";

	export let data: PageData;
	
	$: currentPage = get_current_page($page.url.searchParams);
	$: pages = get_pages($page.url, currentPage, data.itemsPerPage, data.total);
</script>

<svelte:head>
    {#each data.events as event}
        {#if event.imageUrl}
            <link rel="preload" href={event.imageUrl} as="image" />
        {/if}
    {/each}
</svelte:head>

<div class="flex flex-col items-center">
    {#if data.events.length === 0}
        <span class="text-gray-400 dark:text-gray-600">No events</span>
    {/if}
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
    {#if data.events.length > 0}
        <Pagination 
            {pages}
            on:previous={() => { if (data.prevPage != null) goto(get_page_url($page.url, data.prevPage + 1)); }}
                on:next={() => { if (data.nextPage != null) goto(get_page_url($page.url, data.nextPage + 1)); }}
        />
    {/if}
</div>