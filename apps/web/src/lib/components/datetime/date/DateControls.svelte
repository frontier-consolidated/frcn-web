<script lang="ts">
	import { createEventDispatcher } from "svelte";

	import CenturyGrid from "./CenturyGrid.svelte";
	import DateViewControls from "./DateViewControls.svelte";
	import DaysGrid from "./DaysGrid.svelte";
	import DecadeGrid from "./DecadeGrid.svelte";
	import MonthsGrid from "./MonthsGrid.svelte";

	export let viewDate: Date;
	export let selectedDate: Date | null;
	export let disable: "past" | "future" | false = false;

	let zoom_level = 3;
	let previous_zoom_level = zoom_level;

	const dispatch = createEventDispatcher();

	$: {
		if (zoom_level != previous_zoom_level) {
			dispatch("refocus");
			previous_zoom_level = zoom_level;
		}
	}
</script>

<div>
	<DateViewControls bind:viewDate={viewDate} bind:zoomLevel={zoom_level} />
	{#if zoom_level == 3}
		<DaysGrid {disable} viewDate={viewDate} bind:selectedDate={selectedDate} />
	{:else if zoom_level == 2}
		<MonthsGrid bind:viewDate={viewDate} bind:zoomLevel={zoom_level} />
	{:else if zoom_level == 1}
		<DecadeGrid bind:viewDate={viewDate} bind:zoomLevel={zoom_level} />
	{:else}
		<CenturyGrid bind:viewDate bind:zoomLevel={zoom_level} />
	{/if}
</div>
