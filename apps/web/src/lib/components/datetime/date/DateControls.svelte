<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import CenturyGrid from "./CenturyGrid.svelte";
	import DateViewControls from "./DateViewControls.svelte";
	import DaysGrid from "./DaysGrid.svelte";
	import DecadeGrid from "./DecadeGrid.svelte";
	import MonthsGrid from "./MonthsGrid.svelte";

	export let viewDate: Date;
	export let selectedDate: Date | null;

	let zoomLevel = 3;
	let previousZoomLevel = zoomLevel;

	const dispatch = createEventDispatcher();

	$: {
		if (zoomLevel != previousZoomLevel) {
			dispatch("refocus");
			previousZoomLevel = zoomLevel;
		}
	}
</script>

<div>
	<DateViewControls bind:viewDate bind:zoomLevel />
	{#if zoomLevel == 3}
		<DaysGrid {viewDate} bind:selectedDate />
	{:else if zoomLevel == 2}
		<MonthsGrid bind:viewDate bind:zoomLevel />
	{:else if zoomLevel == 1}
		<DecadeGrid bind:viewDate bind:zoomLevel />
	{:else}
		<CenturyGrid bind:viewDate bind:zoomLevel />
	{/if}
</div>
