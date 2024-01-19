<script lang="ts">
	import { getCenturyStartYear } from "../helpers";

	export let viewDate: Date;
	export let zoomLevel: number;

	let years: Date[] = [];
	$: {
		years = [];
		const decadeStart = getCenturyStartYear(viewDate);
		for (let i = 0; i < 10; i++) {
			const date = new Date(decadeStart.getFullYear() + i * 10, viewDate.getMonth());
			years.push(date);
		}
	}
</script>

<div class="grid grid-cols-3 w-64">
	{#each years as year}
		<span
			role="button"
			tabindex="0"
			data-timestamp={year.getTime()}
			class="block rounded-lg text-center text-sm font-semibold p-2 dark:text-white cursor-pointer dark:hover:bg-gray-600"
			on:click={() => {
				viewDate = year;
				zoomLevel = 1;
			}}
			on:keydown={(ev) => {
				if (ev.key == "Enter") {
					viewDate = year;
					zoomLevel = 1;
				}
			}}
		>
			{year.getFullYear()}
		</span>
	{/each}
</div>
