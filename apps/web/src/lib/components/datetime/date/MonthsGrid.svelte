<script lang="ts">
	import { locale } from "svelte-i18n";

	function get_month_abbr(month: Date) {
		return new Intl.DateTimeFormat($locale!, {
			month: "short",
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

<div class="grid grid-cols-4 w-64">
	{#each months as month}
		<span
			role="button"
			tabindex="0"
			data-timestamp={month.getTime()}
			class="block rounded-lg text-center text-sm font-semibold p-2 dark:text-white cursor-pointer dark:hover:bg-gray-600"
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
			{get_month_abbr(month)}
		</span>
	{/each}
</div>
