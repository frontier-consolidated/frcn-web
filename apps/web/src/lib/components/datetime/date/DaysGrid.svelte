<script lang="ts">
	import { locale } from "svelte-i18n";
	import { dates } from "@frcn/shared";

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
	export let disable: "past" | "future" | false;

	function isDisabled(month: Date, day: Date) {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		let disabled = false;
		if (disable) {
			if (disable === "future") {
				disabled ||= day > today;
			} else if (disable === "past") {
				disabled ||= day < today;
			}
		}
		return disabled || !dates.isCurrentMonth(month, day);
	}

	function setDate(date: Date) {
		if (isDisabled(viewDate, date)) return;
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
		const previousMonth = dates.getPreviousMonth(viewDate);
		const daysInMonth = dates.getDaysInMonth(viewDate);
		const daysInPreviousMonth = dates.getDaysInMonth(previousMonth);

		const firstDay = viewDate.getDay();

		days = [];
		for (let i = 0; i < dates.daysPerMonth; i++) {
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
			aria-disabled={isDisabled(viewDate, day)}
			data-timestamp={day.getTime()}
			class="block rounded-lg text-center text-sm font-semibold p-2 {isDisabled(viewDate, day)
				? 'dark:text-gray-500 ' +
					(dates.isSelected(selectedDate, day) ? 'bg-primary-800' : '')
				: 'dark:text-white cursor-pointer ' +
					(dates.isSelected(selectedDate, day)
						? 'bg-primary-600 dark:hover:bg-primary-700'
						: 'dark:hover:bg-gray-600')} 
			{dates.isToday(day) ? 'bg-gray-500' : ''}"
			on:click={() => setDate(day)}
			on:keydown={(ev) => {
				if (ev.key == "Enter") setDate(day);
			}}
		>
			{day.getDate()}
		</span>
	{/each}
</div>
