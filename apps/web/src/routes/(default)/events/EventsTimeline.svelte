<script lang="ts">
	import { goto } from "$app/navigation";
    import { page } from "$app/stores";
	import { strings } from "@frcn/shared";
	import { Timeline, TimelineItem, Card, Breadcrumb, BreadcrumbItem, Pagination } from "flowbite-svelte";
	import { CalendarMonthSolid } from "flowbite-svelte-icons";

	import TimeBadge from "$lib/components/datetime/TimeBadge.svelte";
	import LocationBreadcrumbItem from "$lib/components/location/LocationBreadcrumbItem.svelte";
	import { getCurrentPage, getPageUrl, getPages } from "$lib/pageHelpers";

    import type { PageData } from "./$types";

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
                <Card
                    img={event.imageUrl ?? undefined}
                    horizontal
                    class="w-full !max-w-none"
                    padding="none"
                    href="/event/{event.id}"
                >
                    <div class="flex flex-col gap-2 px-4 py-2">
                        <span class="text-xl font-semibold dark:text-white">
                            {event.name}
                            <Breadcrumb
                                ariaLabel="Event Type and Location"
                                olClass="inline-flex flex-wrap items-center space-x-1 md:space-x-3 rtl:space-x-reverse"
                            >
                                {#if event.eventType}
                                    <BreadcrumbItem home>
                                        <svelte:fragment slot="icon">
                                            <CalendarMonthSolid class="w-4 h-4 me-2" tabindex="-1" />
                                        </svelte:fragment>
                                        {strings.toTitleCase(event.eventType)} Event
                                    </BreadcrumbItem>
                                {/if}
                                {#if event.location}
                                    {#if event.location.length > 0}
                                        {#each event.location as item}
                                            <LocationBreadcrumbItem location={item} />
                                        {/each}
                                    {:else}
                                        <BreadcrumbItem>Anywhere</BreadcrumbItem>
                                    {/if}
                                {:else}
                                    <BreadcrumbItem>???</BreadcrumbItem>
                                {/if}
                            </Breadcrumb>
                        </span>
                        <div>
                            <span class="block text-md font-semibold dark:text-white">
                                Summary
                            </span>
                            <span class="dark:text-gray-400">
                                {event.summary}
                            </span>
                        </div>
                    </div>
                </Card>
            </TimelineItem>
        {/each}
    </Timeline>
    <Pagination 
        {pages}
        on:previous={() => {if (data.prevPage != null) goto(getPageUrl($page.url, data.prevPage + 1))}}
			on:next={() => {if (data.nextPage != null) goto(getPageUrl($page.url, data.nextPage + 1))}}
    />
</div>