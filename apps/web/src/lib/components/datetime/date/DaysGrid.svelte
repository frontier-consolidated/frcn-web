<script lang="ts">
	import { dates } from "@frcn/shared";
	import { locale } from "svelte-i18n";
	import { twMerge } from "tailwind-merge";

	let weekdays: string[] = [];
	$: {
		weekdays = [];
		for (let i = 0; i < 7; i++) {
			const weekdayDate = new Date(0, 0, i);
			weekdays.push(
				new Intl.DateTimeFormat($locale!, {
					weekday: "short"
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
				(relativeDay < 0 ? daysInPreviousMonth + relativeDay : relativeDay % daysInMonth) + 1;
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

<div class="mb-2 grid grid-cols-7">
	{#each weekdays as day (day)}
		<span class="text-center text-sm font-medium dark:text-gray-400">{day}</span>
	{/each}
</div>
<div class="grid w-64 grid-cols-7">
	{#each days as day (day)}
		{@const selected = dates.isSelected(selectedDate, day)}
		{@const disabled = isDisabled(viewDate, day)}
		{@const disabledClass = disabled ? "dark:text-gray-500" : "dark:text-white cursor-pointer"}
		{@const selectedClass = disabled
			? selected
				? "bg-primary-800 dark:text-gray-200"
				: ""
			: selected
				? "bg-primary-600 dark:hover:bg-primary-700"
				: "dark:hover:bg-gray-600"}
		{@const todayClass = dates.isToday(day)
			? twMerge("bg-gray-500", disabled ? "dark:text-gray-400" : undefined)
			: ""}
		<span
			role="button"
			tabindex="0"
			aria-disabled={disabled}
			data-timestamp={day.getTime()}
			class={twMerge(
				"block rounded-lg p-2 text-center text-sm font-semibold",
				disabledClass,
				selectedClass,
				todayClass
			)}
			on:click={() => setDate(day)}
			on:keydown={(ev) => {
				if (ev.key == "Enter") setDate(day);
			}}
		>
			{day.getDate()}
		</span>
	{/each}
</div>
