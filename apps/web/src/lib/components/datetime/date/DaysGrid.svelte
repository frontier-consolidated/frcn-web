<script lang="ts">
	import {
		daysPerMonth,
		getDaysInMonth,
		getPreviousMonth,
		isCurrentMonth,
		isSelected,
		isToday,
	} from "../helpers";
	import { locale } from "svelte-i18n";

	let weekdays: string[] = [];
	$: {
		weekdays = [];
		for (let i = 0; i < 7; i++) {
			const weekdayDate = new Date(0, 0, i);
			weekdays.push(
				new Intl.DateTimeFormat($locale!, {
					weekday: "short",
				})
					.format(weekdayDate)
					.slice(0, 2)
			);
		}
	}

	export let viewDate: Date;
	export let selectedDate: Date | null;

	function setDate(date: Date) {
		if (!isCurrentMonth(viewDate, date)) return;
		const newSelectedDate = new Date(date);
		if (selectedDate) {
			newSelectedDate.setHours(
				selectedDate.getHours(),
				selectedDate.getMinutes(),
				selectedDate.getSeconds()
			);
		}
		selectedDate = newSelectedDate;
	}

	let days: Date[] = [];
	$: {
		const previousMonth = getPreviousMonth(viewDate);
		const daysInMonth = getDaysInMonth(viewDate);
		const daysInPreviousMonth = getDaysInMonth(previousMonth);

		const firstDay = viewDate.getDay();

		days = [];
		for (let i = 0; i < daysPerMonth; i++) {
			const relativeDay = i - firstDay;
			const day =
				(relativeDay < 0 ? daysInPreviousMonth + relativeDay : relativeDay % daysInMonth) +
				1;
			const monthShift = relativeDay < 0 ? -1 : Math.floor(relativeDay / daysInMonth);
			let year = viewDate.getFullYear();
			let month = viewDate.getMonth() + monthShift;
			if (month > 11) {
				month -= 12;
				year++;
			} else if (month < 0) {
				month += 12;
				year--;
			}

			days.push(new Date(year, month, day));
		}
	}
</script>

<div class="grid grid-cols-7 mb-2">
	{#each weekdays as day}
		<span class="font-medium text-center text-sm dark:text-gray-400">{day}</span>
	{/each}
</div>
<div class="grid grid-cols-7 w-64">
	{#each days as day}
		<span
			role="button"
			tabindex="0"
			aria-disabled={!isCurrentMonth(viewDate, day)}
			data-timestamp={day.getTime()}
			class="block rounded-lg text-center text-sm font-semibold p-2 {!isCurrentMonth(
				viewDate,
				day
			)
				? 'dark:text-gray-500 ' + (isSelected(selectedDate, day) ? 'bg-primary-800' : '')
				: 'dark:text-white cursor-pointer ' +
					(isSelected(selectedDate, day)
						? 'bg-primary-600 dark:hover:bg-primary-700'
						: 'dark:hover:bg-gray-600')} 
			{isToday(day) ? 'bg-gray-500' : ''}"
			on:click={() => setDate(day)}
			on:keydown={(ev) => {
				if (ev.key == "Enter") setDate(day);
			}}
		>
			{day.getDate()}
		</span>
	{/each}
</div>
