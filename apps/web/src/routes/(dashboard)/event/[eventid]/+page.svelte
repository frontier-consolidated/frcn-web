<script lang="ts">
	import { strings } from "@frcn/shared";
	import { Tabs, TabItem } from "flowbite-svelte";

	import type { PageData } from "./$types";
	import EventDetails from "./EventDetails.svelte";
	import EventSettings from "./EventSettings.svelte";
	import EventSidebar from "./EventSidebar.svelte";

	export let data: PageData;

	$: eventType = data.eventType ? strings.toTitleCase(data.eventType) : null;

	let settingsOpen = data.posted ? undefined : true
</script>

<svelte:head>
	<title>{data.name ? `${data.name}` : "New Event"} - Event | Frontier Consolidated</title>
	<meta
		name="description"
		content={data.posted
			? `Name: ${data.name}\nType: ${eventType}\nSummary: ${data.summary}`
			: "*Unposted Event*"}
	/>
	<!-- Preload image for improved responsivity -->
	{#if data.imageUrl}
		<link rel="preload" href={data.imageUrl} as="image" />
	{/if}
</svelte:head>

<section class="flex flex-col lg:flex-row gap-2 lg:gap-8 lg:items-stretch">
	<EventSidebar bind:data />
	<section class="flex-1 p-4 pb-8 lg:pr-8 lg:pl-0">
		<Tabs
			style="underline"
			contentClass="p-4 max-w-6xl mx-auto"
		>
			{#if data.posted}
				<TabItem
					open
					title="Details"
					defaultClass="inline-block text-md font-medium text-center disabled:cursor-not-allowed"
				>
					<EventDetails bind:data />
				</TabItem>
				<TabItem
					title="Members"
					defaultClass="inline-block text-md font-medium text-center disabled:cursor-not-allowed"
				></TabItem>
			{/if}
			{#if data.canEdit}
				<TabItem
					bind:open={settingsOpen}
					title="Settings"
					defaultClass="inline-block text-md font-medium text-center disabled:cursor-not-allowed"
				>
					<EventSettings bind:data />
				</TabItem>
			{/if}
		</Tabs>
	</section>
</section>
