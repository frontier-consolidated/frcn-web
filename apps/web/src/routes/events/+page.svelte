<script lang="ts">
	import { EventTypeOptions, Permission, hasOneOfPermissions } from "@frcn/shared";
	import { Heading, TabItem, Tabs, Search, Button as FButton, Toggle, Label } from "flowbite-svelte";
	import { FilterSolid } from "flowbite-svelte-icons";
	import type { Writable } from "svelte/store";
	import { slide } from "svelte/transition";
	import { queryParam } from "sveltekit-search-params";

	import { Button, Head, Hr, Select } from "$lib/components";
	import { user } from "$lib/stores/UserStore";

	import type { PageData } from "./$types";
	import CreateEventButton from "./CreateEventButton.svelte";
	import EventsCalendar from "./EventsCalendar.svelte";
	import EventsTimeline from "./EventsTimeline.svelte";

	export let data: PageData;

	const view = queryParam("view");
	const search = queryParam("q");
	let searchInput = $search;

	let showFilter = false;
	const includeCompleted = queryParam("includecompleted", {
		decode(value) {
			return value === "" ? true : false;
		},
		encode(value) {
			return value ? "" : undefined;
		},
	}) as Writable<boolean>;
	const eventType = queryParam("type");
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
				<div class="flex-1 flex flex-col items-stretch gap-2">
					<div class="flex gap-2">
						<FButton class="rounded px-3 text-gray-600 dark:text-gray-300 bg-gray-50 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600" on:click={() => (showFilter = !showFilter)}>
							<FilterSolid tabindex="-1" class="outline-none" />
						</FButton>
						<Search size="md" placeholder="Search by name" class="sm:max-w-[400px] rounded" 
							bind:value={searchInput} 
							on:keydown={(e) => {
								if (e.key === "Enter") search.set(searchInput);
							}} 
							on:blur={() => {
								search.set(searchInput);
							}} 
						/>
					</div>
					{#if showFilter}
						<div transition:slide={{  }} class="flex flex-col px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded sm:max-w-[454px]">
							<span class="font-semibold text-black dark:text-white">Filter</span>
							<Hr />
							<div class="flex flex-col gap-4">
								<Label for="filter-include-completed" class="flex justify-between items-center flex-wrap gap-2">
									Include completed events
									<Toggle id="filter-include-completed" name="filter-include-completed" disabled={$view === "calendar"} bind:checked={$includeCompleted} classDiv="me-0" />
								</Label>
								<div>
									<Label for="filter-event-type" class="mb-2">Event Type</Label>
									<Select
										id="filter-event-type"
										name="filter-event-type"
										options={[{
											name: "All",
											value: null
										}, ...EventTypeOptions]}
										required
										bind:value={$eventType}
									/>
								</div>
							</div>
						</div>
					{/if}
				</div>
				<div class="sm:self-start shrink-0 flex flex-col justify-end min-[480px]:flex-row gap-2">
					{#if hasOneOfPermissions($user.data?.permissions ?? 0, [Permission.CreateEvents, Permission.ManageEvents])}
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
				data.events = []; // set events to empty while new events get fetched
				view.set("timeline");
			}}>
				<EventsTimeline {data} />
			</TabItem>
			<TabItem title="Calendar" open={$view === "calendar"} on:click={() => {
				data.events = []; // set events to empty while new events get fetched
				view.set("calendar");
			}}>
				<EventsCalendar {data} />
			</TabItem>
		</Tabs>
	</section>
</div>
