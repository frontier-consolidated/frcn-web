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
	<title>My Events | Frontier Consolidated</title>
	<meta name="description" content="Frontier Consolidated - My Events" />
</svelte:head>

<div class="flex flex-col mx-auto w-full max-w-6xl p-4 mt-24">
	<Heading tag="h1" class="font-medium text-4xl">My Events</Heading>
	<Hr />
	<section class="flex flex-col mt-4">
		<div>
			<div class="flex flex-col sm:flex-row gap-2">
				<Search size="md" placeholder="Search by name" class="flex-1 sm:w-96 rounded" bind:value={$search} />
				<CreateEventButton />
			</div>
		</div>
		<div class="flex flex-col gap-2 mt-6">
			{#each data.events as event}
				<EventCard {event} dependency="app:my-events" />
			{/each}
		</div>
	</section>
</div>
