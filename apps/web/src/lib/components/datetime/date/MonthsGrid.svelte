<script lang="ts">
	import { locale } from "svelte-i18n";

	function getMonthAbbr(month: Date) {
		return new Intl.DateTimeFormat($locale!, {
			month: "short"
		}).format(month);
	}

	export let viewDate: Date;
	export let zoomLevel: number;

	let months: Date[] = [];
	$: {
		months = [];
		for (let i = 0; i < 12; i++) {
			const date = new Date(viewDate.getFullYear(), i);
			months.push(date);
		}
	}
</script>

<div class="grid w-64 grid-cols-4">
	{#each months as month (month)}
		<span
			role="button"
			tabindex="0"
			data-timestamp={month.getTime()}
			class="block cursor-pointer rounded-lg p-2 text-center text-sm font-semibold dark:text-white dark:hover:bg-gray-600"
			on:click={() => {
				viewDate = month;
				zoomLevel = 3;
			}}
			on:keydown={(ev) => {
				if (ev.key == "Enter") {
					viewDate = month;
					zoomLevel = 3;
				}
			}}
		>
			{getMonthAbbr(month)}
		</span>
	{/each}
</div>
