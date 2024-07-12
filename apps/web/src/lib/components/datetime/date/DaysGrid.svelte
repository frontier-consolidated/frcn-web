<script lang="ts">
	import { dates } from "@frcn/shared";
	import { locale } from "svelte-i18n";
	import { twMerge } from "tailwind-merge";

	let weekdays: string[] = [];
	$: {
		weekdays = [];
		for (let i = 0; i < 7; i++) {
			const weekday_date = new Date(0, 0, i);
			weekdays.push(
				new Intl.DateTimeFormat($locale!, {
					weekday: "short",
				})
					.format(weekday_date)
					.slice(0, 2)
			);
		}
	}

	export let viewDate: Date;
	export let selectedDate: Date | null;
	export let disable: "past" | "future" | false;

	function is_disabled(month: Date, day: Date) {
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

	function set_date(date: Date) {
		if (is_disabled(viewDate, date)) return;
		const new_selected_date = new Date(date);
		if (selectedDate) {
			new_selected_date.setHours(
				selectedDate.getHours(),
				selectedDate.getMinutes(),
				selectedDate.getSeconds()
			);
		}
		selectedDate = new_selected_date;
	}

	let days: Date[] = [];
	$: {
		const previous_month = dates.getPreviousMonth(viewDate);
		const days_in_month = dates.getDaysInMonth(viewDate);
		const days_in_previous_month = dates.getDaysInMonth(previous_month);

		const first_day = viewDate.getDay();

		days = [];
		for (let i = 0; i < dates.daysPerMonth; i++) {
			const relative_day = i - first_day;
			const day =
				(relative_day < 0 ? days_in_previous_month + relative_day : relative_day % days_in_month) +
				1;
			const month_shift = relative_day < 0 ? -1 : Math.floor(relative_day / days_in_month);
			let year = viewDate.getFullYear();
			let month = viewDate.getMonth() + month_shift;
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
		{@const selected = dates.isSelected(selectedDate, day)}
		{@const disabled = is_disabled(viewDate, day)}
		{@const disabled_class = disabled ? "dark:text-gray-500" : "dark:text-white cursor-pointer"}
		{@const selected_class = disabled ? selected ? "bg-primary-800 dark:text-gray-200" : "" : selected ? "bg-primary-600 dark:hover:bg-primary-700" : "dark:hover:bg-gray-600"}
		{@const today_class = dates.isToday(day) ? twMerge("bg-gray-500", disabled ? "dark:text-gray-400" : undefined) : ""}
		<span
			role="button"
			tabindex="0"
			aria-disabled={disabled}
			data-timestamp={day.getTime()}
			class={twMerge("block rounded-lg text-center text-sm font-semibold p-2", disabled_class, selected_class, today_class)}
			on:click={() => set_date(day)}
			on:keydown={(ev) => {
				if (ev.key == "Enter") set_date(day);
			}}
		>
			{day.getDate()}
		</span>
	{/each}
</div>
