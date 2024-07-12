<script lang="ts">
	import { strings } from "@frcn/shared";
	import { Tabs, TabItem } from "flowbite-svelte";

	import { Head, ScreenQuery } from "$lib/components";

	import type { PageData } from "./$types";
	import EventDetails from "./EventDetails.svelte";
	import EventMembers from "./EventMembers.svelte";
	import EventSettings from "./EventSettings.svelte";
	import EventSidebar from "./EventSidebar.svelte";

	export let data: PageData;

	$: eventType = data.eventType ? strings.toTitleCase(data.eventType) : null;

	let settings_open = data.posted ? undefined : true;
</script>

<Head
	title="{data.name ? `${data.name}` : "New Event"} - Event"
	description={data.posted ? `Name: ${data.name}\nType: ${eventType}\nSummary: ${data.summary}` : "*Unposted Event*"}
	image={data.imageUrl ?? undefined}
>
	{#if data.imageUrl}
		<link rel="preload" href={data.imageUrl} as="image" />
	{/if}
</Head>

<section class="flex-1 flex flex-col lg:flex-row lg:gap-8 lg:items-stretch mt-[72px]">
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
				<ScreenQuery size="lg" let:matches>
					{#if !matches}
						<TabItem
							title="Members"
							defaultClass="inline-block text-md font-medium text-center disabled:cursor-not-allowed"
						>
							<EventMembers bind:data />
						</TabItem>
					{/if}
				</ScreenQuery>
			{/if}
			{#if data.canEdit}
				<TabItem
					bind:open={settings_open}
					title="Settings"
					defaultClass="inline-block text-md font-medium text-center disabled:cursor-not-allowed"
				>
					<EventSettings bind:data />
				</TabItem>
			{/if}
		</Tabs>
	</section>
</section>
