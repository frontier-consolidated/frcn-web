<script lang="ts">
	import { Heading, Search } from "flowbite-svelte";
	import { queryParam } from "sveltekit-search-params";

	import { Button, Head, Hr } from "$lib/components";

	import type { PageData } from "./$types";
	import CreateEventButton from "../CreateEventButton.svelte";
	import EventCard from "../EventCard.svelte";

	export let data: PageData;

	const search = queryParam("q");
	let searchInput = $search;
</script>

<Head title="My Events" description="My events" />

<div class="mx-auto mt-24 flex w-full max-w-6xl flex-col p-4">
	<Heading tag="h1" class="text-4xl font-medium">My Events</Heading>
	<Hr />
	<section class="mt-4 flex flex-col">
		<div>
			<div class="flex flex-col gap-2 sm:flex-row">
				<Search
					size="md"
					placeholder="Search by name"
					class="rounded sm:max-w-[400px]"
					bind:value={searchInput}
					on:keydown={(e) => {
						if (e.key === "Enter") search.set(searchInput);
					}}
					on:blur={() => {
						search.set(searchInput);
					}}
				/>
				<div class="flex shrink-0 flex-col justify-end gap-2 min-[480px]:flex-row">
					<Button color="alternative" class="sm:shrink-0 md:flex-1" href="/events">
						All Events
					</Button>
					<CreateEventButton />
				</div>
			</div>
		</div>
		<div class="mt-6 flex flex-col gap-2">
			{#each data.events as event}
				<EventCard {event} dependency="app:my-events" />
			{/each}
		</div>
	</section>
</div>
