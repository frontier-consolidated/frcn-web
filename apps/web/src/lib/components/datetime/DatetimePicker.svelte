<script lang="ts">
	import { Input, Dropdown, DropdownHeader } from "flowbite-svelte";
	import { CalendarEditSolid } from "flowbite-svelte-icons";
	import { locale } from "svelte-i18n";
	import { twMerge } from "tailwind-merge";

	import DateControls from "./date/DateControls.svelte";
	import TimeControls from "./time/TimeControls.svelte";

	export let id: string;
	export let title: string | undefined = undefined;
	export let value: Date | null = null;
	export let disable: "past" | "future" | false = false;

	let dropdownOpen = false;

	let initViewDate = value ?? new Date();
	let selectedDate: Date | null = null;
	let viewDate = new Date(initViewDate.getFullYear(), initViewDate.getMonth());

	function formatDate(date: Date) {
		return new Intl.DateTimeFormat($locale!, {
			dateStyle: "short",
			timeStyle: "short",
		}).format(date);
	}

	function isNaD(date: Date) {
		return !(date instanceof Date && !isNaN(date as unknown as number));
	}

	let inputValue: string = "";
	$: {
		if (value != selectedDate) {
			if (value != null && selectedDate == null) {
				selectedDate = value;
			} else {
				value = selectedDate;
			}
			inputValue = selectedDate ? formatDate(selectedDate) : inputValue;
		} else if (inputValue && (!selectedDate || inputValue != formatDate(selectedDate))) {
			let valueDate = new Date(inputValue);
			if (isNaD(valueDate)) {
				let timestamp = Number(inputValue);
				if (!isNaN(timestamp)) {
					// if bigger than some time much further in the future then it is probably already in milliseconds
					timestamp = timestamp * 1000 >= 2e13 ? timestamp : timestamp * 1000;
					valueDate = new Date(timestamp);
				}
			}

			if (isNaD(valueDate)) {
				inputValue = selectedDate ? formatDate(selectedDate) : inputValue;
			} else {
				selectedDate = valueDate;
				viewDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth());
				inputValue = formatDate(valueDate);
				value = valueDate;
			}
		}
	}

	let input: HTMLElement | undefined = undefined;
	function init(el: HTMLElement) {
		input = el;
	}
</script>

<div id="{id}-ref" use:init>
	<Input
		{...$$restProps}
		{id}
		placeholder="Select date and time"
		class={twMerge("rounded", $$restProps.class)}
		bind:value={inputValue}
	>
		<CalendarEditSolid slot="left" size="sm" class="ms-1" tabindex="-1" />
	</Input>
</div>
<Dropdown
	bind:open={dropdownOpen}
	triggeredBy="#{id}-ref"
	containerClass="divide-y z-50 rounded"
	class="border rounded border-gray-300 dark:border-gray-600 p-4"
>
	{#if title}
		<DropdownHeader class="text-center">
			{title}
		</DropdownHeader>
	{/if}
	<div class="grid grid-flow-col auto-cols-max gap-2">
		<DateControls
			{disable}
			bind:viewDate
			bind:selectedDate
			on:refocus={() => {
				input?.focus();
			}}
		/>
		<TimeControls bind:selectedDate />
	</div>
</Dropdown>
