<script lang="ts">
	import { page } from "$app/stores";
	import { Permission, hasPermission } from "@frcn/shared";
	import { Heading, TabItem, Tabs, Search, Button } from "flowbite-svelte";
	import { queryParam } from "sveltekit-search-params"

	import Hr from "$lib/components/Hr.svelte";
	import { user } from "$lib/stores/UserStore";

	import type { PageData } from "./$types";
	import CreateEventButton from "./CreateEventButton.svelte";
	import EventsTimeline from "./EventsTimeline.svelte";

	export let data: PageData;

	const search = queryParam("q")
</script>

<svelte:head>
	<title>Events | Frontier Consolidated</title>
	<meta name="description" content="Frontier Consolidated - Search Events" />
</svelte:head>

<div class="flex flex-col mx-auto w-full max-w-6xl p-4 mt-24">
	<Heading tag="h1" class="font-medium text-4xl">Events</Heading>
	<Hr />
	<section class="flex flex-col mt-4">
		<div>
			<div class="flex flex-col sm:flex-row gap-2">
				<Search size="md" placeholder="Search by name" class="sm:max-w-[400px] rounded" bind:value={$search} />
				<div class="shrink-0 flex flex-col justify-end min-[480px]:flex-row gap-2">
					{#if hasPermission($user.data?.permissions ?? 0, Permission.CreateEvents)}
						<Button color="alternative" class="group/my-events md:flex-1 rounded clip-opposite-3 p-px border-none bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-700 sm:shrink-0" href="/events/me">
							<div class="flex items-center justify-center w-full h-full rounded clip-opposite-3 px-5 py-2.5 bg-white group-hover/my-events:bg-gray-100 dark:bg-gray-950 dark:group-hover/my-events:bg-gray-950">
								My Events
							</div>
						</Button>
					{/if}
					<CreateEventButton />
				</div>
			</div>
		</div>
		<Tabs contentClass="mt-6" style="underline">
			<TabItem title="Timeline" open={$page.url.hash.length < 2 || $page.url.hash === "#timeline"} on:click={() => window.location.hash = "#timeline"}>
				<EventsTimeline {data} />
			</TabItem>
			<TabItem title="Calendar" open={$page.url.hash === "#calendar"} on:click={() => window.location.hash = "#calendar"}>
				
			</TabItem>
		</Tabs>
	</section>
</div>
