<script lang="ts">
	import { Heading, Search } from "flowbite-svelte";
	import { queryParam } from "sveltekit-search-params"

	import Hr from "$lib/components/Hr.svelte";

	import type { PageData } from "./$types";
	import CreateEventButton from "../CreateEventButton.svelte";
	import EventCard from "../EventCard.svelte";

	export let data: PageData;

	const search = queryParam("q")
</script>

<svelte:head>
	<title>Events - My Events</title>
	<meta name="description" content="Frontier Consolidated - My Events" />
</svelte:head>

<Heading tag="h1" class="font-medium text-4xl">My Events</Heading>
<Hr />
<section class="flex flex-col mt-4">
	<div>
		<div class="flex flex-col sm:flex-row gap-2">
			<Search size="md" placeholder="Search by name" class="flex-1 sm:w-96" bind:value={$search} />
			<CreateEventButton />
		</div>
	</div>
	<div class="flex flex-col gap-2 mt-6">
        {#each data.events as event}
            <EventCard {event} />
        {/each}
    </div>
</section>
