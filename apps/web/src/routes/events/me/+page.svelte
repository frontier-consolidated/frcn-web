<script lang="ts">
	import { Heading, Search } from "flowbite-svelte";
	import { queryParam } from "sveltekit-search-params";

	import { Button, Head, Hr } from "$lib/components";

	import type { PageData } from "./$types";
	import CreateEventButton from "../CreateEventButton.svelte";
	import EventCard from "../EventCard.svelte";

	export let data: PageData;

	const search = queryParam("q");
	let search_input = $search;
</script>

<Head
	title="My Events"
	description="My events"
/>

<div class="flex flex-col mx-auto w-full max-w-6xl p-4 mt-24">
	<Heading tag="h1" class="font-medium text-4xl">My Events</Heading>
	<Hr />
	<section class="flex flex-col mt-4">
		<div>
			<div class="flex flex-col sm:flex-row gap-2">
				<Search size="md" placeholder="Search by name" class="sm:max-w-[400px] rounded"
					bind:value={search_input} 
					on:keydown={(e) => {
						if (e.key === "Enter") search.set(search_input);
					}} 
					on:blur={() => {
						search.set(search_input);
					}} 
				/>
				<div class="shrink-0 flex flex-col justify-end min-[480px]:flex-row gap-2">
					<Button color="alternative" class="md:flex-1 sm:shrink-0" href="/events">
						All Events
					</Button>
					<CreateEventButton />
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-2 mt-6">
			{#each data.events as event}
				<EventCard {event} dependency="app:my-events" />
			{/each}
		</div>
	</section>
</div>
