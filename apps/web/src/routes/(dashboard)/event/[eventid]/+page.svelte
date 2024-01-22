<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Tabs, TabItem } from "flowbite-svelte";
	import { CalendarMonthSolid } from "flowbite-svelte-icons";
	import TimeBadge from "$lib/components/datetime/TimeBadge.svelte";
	import LocationBreadcrumbItem from "$lib/components/location/LocationBreadcrumbItem.svelte";
	import Markdown from "$lib/components/markdown/Markdown.svelte";
	import ViewMore from "$lib/components/ViewMore.svelte";
	import type { PageData } from "./$types";
	import EventSettings from "./EventSettings.svelte";
	import EventMemberList from "./EventMemberList.svelte";

	export let data: PageData;

	let isFutureEvent = data.startAt ? new Date(data.startAt) >= new Date() : true;
	$: eventType = data.eventType ? toTitleCase(data.eventType) : null;

	function toTitleCase(str: string) {
		return str
			.toLowerCase()
			.replaceAll("_", " ")
			.split(" ")
			.map((word) => word[0].toUpperCase() + word.slice(1))
			.join(" ");
	}
</script>

<svelte:head>
	<title>{data.name ? `Event - ${data.name}` : "New Event"}</title>
	<meta
		name="description"
		content={data.posted
			? `Name: ${data.name}\nType: ${eventType}\nSummary: ${data.summary}`
			: "*Unposted Event*"}
	/>
</svelte:head>

<section class="flex space-x-8">
	<EventMemberList bind:data />

	<section class="flex-1 flex flex-col gap-4 py-2">
		<h1 class="text-2xl font-semibold dark:text-white">{data.name ? data.name : "New Event"}</h1
		>
		<Breadcrumb
			ariaLabel="Event Type and Location"
			olClass="inline-flex flex-wrap items-center space-x-1 md:space-x-3 rtl:space-x-reverse"
		>
			{#if eventType}
				<BreadcrumbItem home>
					<svelte:fragment slot="icon">
						<CalendarMonthSolid class="w-4 h-4 me-2" />
					</svelte:fragment>
					{eventType} Event
				</BreadcrumbItem>
			{/if}
			{#if data.location}
				{#each data.location as item}
					<LocationBreadcrumbItem location={item} />
				{/each}
			{:else}
				<BreadcrumbItem>???</BreadcrumbItem>
			{/if}
		</Breadcrumb>
		<div class="flex flex-wrap gap-4">
			<span class="text-sm font-semibold dark:text-gray-400">
				{#if data.startAt}
					{#key data.startAt}
						{isFutureEvent ? "Starts" : "Started"}: <TimeBadge
							id="event-start-badge"
							format="datetime-relative"
							value={data.startAt}
						/>
					{/key}
				{/if}
			</span>
			<span class="text-sm font-semibold dark:text-gray-400">
				{#if data.duration}
					{#key data.duration}
						Duration: <TimeBadge
							id="event-duration-badge"
							format="duration"
							value={data.duration}
						/>
					{/key}
				{/if}
			</span>
		</div>
		<div class="max-w-[60rem]">
			<h2 class="text-lg font-semibold dark:text-white mt-4">Details</h2>
			<ViewMore>
				<Markdown
					class={data.description ? "dark:text-gray-400" : "dark:text-gray-600"}
					source={data.description ? data.description : "No Description"}
				/>
			</ViewMore>
		</div>
		<div>
			<Tabs
				style="underline"
				class="max-w-5xl mx-auto"
				contentClass="p-4 bg-gray-50 rounded-lg dark:bg-gray-800 mt-4 max-w-5xl mx-auto"
			>
				{#if data.posted}
					<TabItem
						title="Overview"
						defaultClass="inline-block text-md font-medium text-center disabled:cursor-not-allowed"
					></TabItem>
					<TabItem
						title="Members"
						defaultClass="inline-block text-md font-medium text-center disabled:cursor-not-allowed"
					></TabItem>
				{/if}
				{#if data.canEdit}
					<TabItem
						open
						title="Settings"
						defaultClass="inline-block text-md font-medium text-center disabled:cursor-not-allowed"
					>
						<EventSettings bind:data />
					</TabItem>
				{/if}
			</Tabs>
		</div>
	</section>
</section>
