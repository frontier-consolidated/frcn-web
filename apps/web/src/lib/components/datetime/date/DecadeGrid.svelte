<script lang="ts">
	import { dates } from "@frcn/shared";

	export let viewDate: Date;
	export let zoomLevel: number;

	let years: Date[] = [];
	$: {
		years = [];
		const decadeStart = dates.getDecadeStartYear(viewDate);
		for (let i = 0; i < 10; i++) {
			const date = new Date(decadeStart.getFullYear() + i, viewDate.getMonth());
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
				zoomLevel = 2;
			}}
			on:keydown={(ev) => {
				if (ev.key == "Enter") {
					viewDate = year;
					zoomLevel = 2;
				}
			}}
		>
			{year.getFullYear()}
		</span>
	{/each}
</div>
