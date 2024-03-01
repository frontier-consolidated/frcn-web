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
	<title>Events</title>
	<meta name="description" content="Frontier Consolidated - Search Events" />
</svelte:head>

<Heading tag="h1" class="font-medium text-4xl">Events</Heading>
<Hr />
<section class="flex flex-col gap-2 mt-4">
	<div>
		<div class="flex flex-col sm:flex-row gap-2">
			<Search size="md" placeholder="Search by name" class="sm:max-w-[400px]" bind:value={$search} />
			<div class="shrink-0 flex flex-col justify-end min-[480px]:flex-row gap-2">
				{#if hasPermission($user.data?.permissions ?? 0, Permission.CreateEvents)}
					<Button color="alternative" class="sm:shrink-0" href="/events/me">My Events</Button>
				{/if}
				<CreateEventButton />
			</div>
		</div>
	</div>
	<Tabs contentClass="p-4" style="underline">
		<TabItem title="Timeline" open={$page.url.hash.length < 2 || $page.url.hash === "#timeline"} on:click={() => window.location.hash = "#timeline"}>
			<EventsTimeline {data} />
		</TabItem>
		<TabItem title="Calendar" open={$page.url.hash === "#calendar"} on:click={() => window.location.hash = "#calendar"}>
			
		</TabItem>
	</Tabs>
</section>
