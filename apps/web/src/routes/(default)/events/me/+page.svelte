<script lang="ts">
	import { strings } from "@frcn/shared";
	import { Breadcrumb, BreadcrumbItem, Card, Heading, Search } from "flowbite-svelte";
	import { CalendarMonthSolid } from "flowbite-svelte-icons";
	import { queryParam } from "sveltekit-search-params"

	import Hr from "$lib/components/Hr.svelte";
	import LocationBreadcrumbItem from "$lib/components/location/LocationBreadcrumbItem.svelte";
    import placeholder from "$lib/images/stock/placeholder.jpg"

	import type { PageData } from "./$types";
	import CreateEventButton from "../CreateEventButton.svelte";

	export let data: PageData;

	const search = queryParam("q")
</script>

<svelte:head>
	<title>Events - My Events</title>
	<meta name="description" content="Frontier Consolidated - My Events" />
</svelte:head>

<Heading tag="h1" class="font-medium text-4xl">My Events</Heading>
<Hr />
<section class="flex flex-col gap-2 mt-4">
	<div>
		<div class="flex flex-col sm:flex-row gap-2">
			<Search size="md" placeholder="Search by name" class="flex-1 sm:w-96" bind:value={$search} />
			<CreateEventButton />
		</div>
	</div>
	<div class="flex flex-col gap-2">
        {#each data.events as event}
            <Card
                horizontal
                padding="none"
                class="w-full !max-w-none"
                href="/event/{event.id}"
            >
                <img src={event.imageUrl ?? placeholder} alt="Event thumbnail" class="rounded-t-lg object-cover w-full h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" on:error={(e) => {
                    e.currentTarget.setAttribute("src", placeholder)
                }} />
                <div class="flex flex-col gap-2 px-4 py-2">
                    <span class="text-xl font-semibold dark:text-white">
                        {event.name ? event.name : "Unnamed Event"}
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
                    {#if event.summary}
                        <div>
                            <span class="block text-md font-semibold dark:text-white">
                                Summary
                            </span>
                            <span class="dark:text-gray-400">
                                {event.summary}
                            </span>
                        </div>
                    {/if}
                </div>
            </Card>
        {/each}
    </div>
</section>
