<script lang="ts">
	import { Button } from "flowbite-svelte";
	import { ArrowLeftSolid, ArrowRightSolid } from "flowbite-svelte-icons";
	import { locale } from "svelte-i18n";
	import {
		getCenturyStartYear,
		getDecadeStartYear,
		getNextCentury,
		getNextDecade,
		getNextMonth,
		getNextYear,
		getPreviousCentury,
		getPreviousDecade,
		getPreviousMonth,
		getPreviousYear,
	} from "../helpers";

	export let viewDate: Date;
	export let zoomLevel: number;

	let zoomText: string = "";
	$: {
		switch (zoomLevel) {
			case 3:
				zoomText = new Intl.DateTimeFormat($locale!, {
					month: "long",
					year: "numeric",
				}).format(viewDate);
				break;
			case 2:
				zoomText = new Intl.DateTimeFormat($locale!, {
					year: "numeric",
				}).format(viewDate);
				break;
			case 1:
				{
					const startYear = getDecadeStartYear(viewDate);
					zoomText = `${startYear.getFullYear()} - ${startYear.getFullYear() + 9}`;
				}
				break;
			case 0:
				{
					const startYear = getCenturyStartYear(viewDate);
					zoomText = `${startYear.getFullYear()} - ${startYear.getFullYear() + 90}`;
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
					viewDate = getPreviousMonth(viewDate);
					break;
				case 2:
					viewDate = getPreviousYear(viewDate);
					break;
				case 1:
					viewDate = getPreviousDecade(viewDate);
					break;
				case 0:
					viewDate = getPreviousCentury(viewDate);
					break;
			}
		}}
	>
		<ArrowLeftSolid size="xs" />
	</Button>
	<Button
		class="dark:bg-gray-700 dark:hover:bg-gray-600"
		on:click={() => {
			zoomLevel = Math.max(0, zoomLevel - 1);
		}}
	>
		{zoomText}
	</Button>
	<Button
		class="dark:bg-gray-700 dark:hover:bg-gray-600 p-3"
		on:click={() => {
			switch (zoomLevel) {
				case 3:
					viewDate = getNextMonth(viewDate);
					break;
				case 2:
					viewDate = getNextYear(viewDate);
					break;
				case 1:
					viewDate = getNextDecade(viewDate);
					break;
				case 0:
					viewDate = getNextCentury(viewDate);
					break;
			}
		}}
	>
		<ArrowRightSolid size="xs" />
	</Button>
</div>
