<script lang="ts">
	import { twMerge } from "tailwind-merge";

	import Select from "../select/Select.svelte";

	const hourOptions = new Array(24).fill(0).map((_, index) => ({
		value: index,
		name: `${index} hour${index == 1 ? "" : "s"}`
	}));

	const minuteOptions = new Array(12)
		.fill(0)
		.map((_, index) => index * 5)
		.map((value) => ({
			value,
			name: `${value} minute${value == 1 ? "" : "s"}`
		}));

	export let id: string;
	export let name: string;
	export let value: number | null = null;
	export let required: boolean | undefined = undefined;
	export let disabled = false;

	let hour: number | null = null;
	let minute: number | null = null;
	$: {
		if (hour !== null || minute !== null) {
			hour ??= 0;
			minute ??= 0;
			value = hour * 3600 * 1000 + minute * 60 * 1000;
		}
	}
</script>

<div class={twMerge("flex gap-2", $$restProps.class)}>
	<Select
		class="flex-1"
		id="{id}-hour"
		name="{name}-hour"
		options={hourOptions}
		placeholder="Select hours"
		{required}
		{disabled}
		bind:value={hour}
	/>
	<Select
		class="flex-1"
		id="{id}-minute"
		name="{name}-minute"
		options={minuteOptions}
		placeholder="Select minutes"
		{required}
		{disabled}
		bind:value={minute}
	/>
</div>
