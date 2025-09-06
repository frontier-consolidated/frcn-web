<script lang="ts">
	import { strings } from "@frcn/shared";
	import type { AnyLocation } from "@frcn/shared/locations";
	import { Breadcrumb, BreadcrumbItem } from "flowbite-svelte";
	import { CalendarMonthSolid } from "flowbite-svelte-icons";

	import { LocationBreadcrumbItem } from "$lib/components";

	export let event: { eventType?: string | null; location: AnyLocation[] | null };
	$: eventType = event.eventType ? strings.toTitleCase(event.eventType) : null;
</script>

<Breadcrumb
	ariaLabel="Event Type and Location"
	olClass="inline-flex flex-wrap items-center space-x-1 md:space-x-3 rtl:space-x-reverse"
>
	{#if eventType}
		<BreadcrumbItem home>
			<svelte:fragment slot="icon">
				<CalendarMonthSolid class="me-2 h-4 w-4" tabindex="-1" />
			</svelte:fragment>
			{eventType} Event
		</BreadcrumbItem>
	{/if}
	{#if event.location}
		{#if event.location.length > 0}
			{#each event.location as item (item.name)}
				<LocationBreadcrumbItem location={item} />
			{/each}
		{:else}
			<BreadcrumbItem>Anywhere</BreadcrumbItem>
		{/if}
	{:else}
		<BreadcrumbItem>???</BreadcrumbItem>
	{/if}
</Breadcrumb>
