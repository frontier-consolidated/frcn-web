<script lang="ts">
	import { dates } from "@frcn/shared";
	import { Button } from "flowbite-svelte";
	import { ArrowLeftSolid, ArrowRightSolid } from "flowbite-svelte-icons";
	import { locale } from "svelte-i18n";

	export let viewDate: Date;
	export let zoomLevel: number;

	let zoom_text: string = "";
	$: {
		switch (zoomLevel) {
			case 3:
				zoom_text = new Intl.DateTimeFormat($locale!, {
					month: "long",
					year: "numeric",
				}).format(viewDate);
				break;
			case 2:
				zoom_text = new Intl.DateTimeFormat($locale!, {
					year: "numeric",
				}).format(viewDate);
				break;
			case 1:
				{
					const start_year = dates.getDecadeStartYear(viewDate);
					zoom_text = `${start_year.getFullYear()} - ${start_year.getFullYear() + 9}`;
				}
				break;
			case 0:
				{
					const start_year = dates.getCenturyStartYear(viewDate);
					zoom_text = `${start_year.getFullYear()} - ${start_year.getFullYear() + 90}`;
				}
				break;
		}
	}
</script>

<div class="flex justify-between mb-2">
	<Button
		class="dark:bg-gray-700 dark:hover:bg-gray-600 p-3"
		on:click={() => {
			switch (zoomLevel) {
				case 3:
					viewDate = dates.getPreviousMonth(viewDate);
					break;
				case 2:
					viewDate = dates.getPreviousYear(viewDate);
					break;
				case 1:
					viewDate = dates.getPreviousDecade(viewDate);
					break;
				case 0:
					viewDate = dates.getPreviousCentury(viewDate);
					break;
			}
		}}
	>
		<ArrowLeftSolid size="xs" tabindex="-1" />
	</Button>
	<Button
		class="dark:bg-gray-700 dark:hover:bg-gray-600"
		on:click={() => {
			zoomLevel = Math.max(0, zoomLevel - 1);
		}}
	>
		{zoom_text}
	</Button>
	<Button
		class="dark:bg-gray-700 dark:hover:bg-gray-600 p-3"
		on:click={() => {
			switch (zoomLevel) {
				case 3:
					viewDate = dates.getNextMonth(viewDate);
					break;
				case 2:
					viewDate = dates.getNextYear(viewDate);
					break;
				case 1:
					viewDate = dates.getNextDecade(viewDate);
					break;
				case 0:
					viewDate = dates.getNextCentury(viewDate);
					break;
			}
		}}
	>
		<ArrowRightSolid size="xs" tabindex="-1" />
	</Button>
</div>
