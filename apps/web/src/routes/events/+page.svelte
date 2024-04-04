<script lang="ts">
	import { page } from "$app/stores";
	import { Permission, hasPermission } from "@frcn/shared";
	import { Heading, TabItem, Tabs, Search } from "flowbite-svelte";
	import { queryParam } from "sveltekit-search-params"

	import { Button, Head, Hr } from "$lib/components";
	import { user } from "$lib/stores/UserStore";

	import type { PageData } from "./$types";
	import CreateEventButton from "./CreateEventButton.svelte";
	import EventsCalendar from "./EventsCalendar.svelte";
	import EventsTimeline from "./EventsTimeline.svelte";

	export let data: PageData;

	const view = queryParam("view")
	const search = queryParam("q")
	let searchInput = $search
</script>

<Head
	title="Events"
	description="Search our events"
/>

<div class="flex flex-col mx-auto w-full max-w-6xl p-4 mt-24">
	<Heading tag="h1" class="font-medium text-4xl">Events</Heading>
	<Hr />
	<section class="flex flex-col mt-4">
		<div>
			<div class="flex flex-col sm:flex-row gap-2">
				<Search size="md" placeholder="Search by name" class="sm:max-w-[400px] rounded" 
					bind:value={searchInput} 
					on:keydown={(e) => {
						if (e.key === "Enter") search.set(searchInput);
					}} 
					on:blur={() => {
						search.set(searchInput)
					}} 
				/>
				<div class="shrink-0 flex flex-col justify-end min-[480px]:flex-row gap-2">
					{#if hasPermission($user.data?.permissions ?? 0, Permission.CreateEvents)}
						<Button color="alternative" class="md:flex-1 sm:shrink-0" href="/events/me">
							My Events
						</Button>
					{/if}
					<CreateEventButton />
				</div>
			</div>
		</div>
		<Tabs contentClass="mt-6" style="underline">
			<TabItem title="Timeline" open={!$view || $view === "timeline"} on:click={() => {
				data.events = [] // set events to empty while new events get fetched
				view.set("timeline")
			}}>
				<EventsTimeline {data} />
			</TabItem>
			<TabItem title="Calendar" open={$view === "calendar"} on:click={() => {
				data.events = [] // set events to empty while new events get fetched
				view.set("calendar")
			}}>
				<EventsCalendar {data} />
			</TabItem>
		</Tabs>
	</section>
</div>
