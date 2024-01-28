<script lang="ts">
	import type { AnyLocation } from "@frcn/shared/locations";
	import { BreadcrumbItem } from "flowbite-svelte";

	import LocationIcon from "./LocationIcon.svelte";

	export let location: AnyLocation;
</script>

<BreadcrumbItem
	spanClass="flex items-center ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400"
>
	{#key location}
		<LocationIcon {location} class="shrink-0 w-4 h-4 me-2" />
	{/key}
	{location.name}
</BreadcrumbItem>
