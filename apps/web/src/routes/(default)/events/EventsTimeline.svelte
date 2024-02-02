<script lang="ts">
	import { goto } from "$app/navigation";
    import { page } from "$app/stores";
	import { strings } from "@frcn/shared";
	import { Timeline, type LinkType, TimelineItem, Card, Breadcrumb, BreadcrumbItem, Pagination } from "flowbite-svelte";
	import { CalendarMonthSolid } from "flowbite-svelte-icons";

	import TimeBadge from "$lib/components/datetime/TimeBadge.svelte";
	import LocationBreadcrumbItem from "$lib/components/location/LocationBreadcrumbItem.svelte";

    import type { PageData } from "./$types";

	export let data: PageData;

    function getCurrentPage(query: URLSearchParams) {
		let pageNum = Number(query.get("page") ?? "1")
		if (isNaN(pageNum)) return 0;
		return pageNum - 1
	}

	function getPages(path: string, query: URLSearchParams, currentPage: number, itemsPerPage: number, total: number) {
		const pages: LinkType[] = []

		const lastPage = Math.ceil(total / itemsPerPage) - 1

		let startPage = Math.max(0, currentPage - 2)
		const endPage = Math.max(0, Math.min(lastPage, startPage + 4))
		startPage = Math.max(0, Math.min(startPage, endPage - 4))

		for (let p = 0; p < (endPage - startPage + 1); p++) {
			const page = startPage + p;
            const pageQuery = new URLSearchParams(query)
            pageQuery.set("page", `${page + 1}`)

			pages.push({
				name: `${page + 1}`,
				href: `${path}?${pageQuery.toString()}`,
				active: page === currentPage,
			})
		}

		return pages;
	}
	
	$: currentPage = getCurrentPage($page.url.searchParams);
	$: pages = getPages("/events", $page.url.searchParams, currentPage, data.itemsPerPage, data.total);
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
                                            <CalendarMonthSolid class="w-4 h-4 me-2" />
                                        </svelte:fragment>
                                        {strings.toTitleCase(event.eventType)} Event
                                    </BreadcrumbItem>
                                {/if}
                                {#if event.location}
                                    {#each event.location as item}
                                        <LocationBreadcrumbItem location={item} />
                                    {/each}
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
        on:previous={() => {if (data.prevPage) goto(`/events?page=${data.prevPage + 1}`)}}
        on:next={() => {if (data.nextPage) goto(`/events?page=${data.nextPage + 1}`)}}
    />
</div>