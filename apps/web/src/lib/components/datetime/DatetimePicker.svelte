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

	let dropdown_open = false;

	let init_view_date = value ?? new Date();
	let selected_date: Date | null = null;
	let view_date = new Date(init_view_date.getFullYear(), init_view_date.getMonth());

	function format_date(date: Date) {
		return new Intl.DateTimeFormat($locale!, {
			dateStyle: "short",
			timeStyle: "short",
		}).format(date);
	}

	function is_nad(date: Date) {
		return !(date instanceof Date && !isNaN(date as unknown as number));
	}

	let input_value: string = "";
	$: {
		if (value != selected_date) {
			if (value != null && selected_date == null) {
				selected_date = value;
			} else {
				value = selected_date;
			}
			input_value = selected_date ? format_date(selected_date) : input_value;
		} else if (input_value && (!selected_date || input_value != format_date(selected_date))) {
			let value_date = new Date(input_value);
			if (is_nad(value_date)) {
				let timestamp = Number(input_value);
				if (!isNaN(timestamp)) {
					// if bigger than some time much further in the future then it is probably already in milliseconds
					timestamp = timestamp * 1000 >= 2e13 ? timestamp : timestamp * 1000;
					value_date = new Date(timestamp);
				}
			}

			if (is_nad(value_date)) {
				input_value = selected_date ? format_date(selected_date) : input_value;
			} else {
				selected_date = value_date;
				view_date = new Date(selected_date.getFullYear(), selected_date.getMonth());
				input_value = format_date(value_date);
				value = value_date;
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
		bind:value={input_value}
	>
		<CalendarEditSolid slot="left" size="sm" class="ms-1" tabindex="-1" />
	</Input>
</div>
<Dropdown
	bind:open={dropdown_open}
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
			bind:viewDate={view_date}
			bind:selectedDate={selected_date}
			on:refocus={() => {
				input?.focus();
			}}
		/>
		<TimeControls bind:selectedDate={selected_date} />
	</div>
</Dropdown>
