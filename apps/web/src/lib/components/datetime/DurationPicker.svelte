<script lang="ts">
	import { dates } from "@frcn/shared";
	import { Input, Dropdown, DropdownHeader } from "flowbite-svelte";
	import { ClockSolid } from "flowbite-svelte-icons";
	import { twMerge } from "tailwind-merge";

	import DurationControls from "./duration/DurationControls.svelte";

	export let id: string;
	export let title: string | undefined = undefined;
	export let value: number | null = null;

	let dropdown_open = false;

	let input_value: string = "";
	$: {
		if (input_value && (!value || input_value != dates.toDuration(value))) {
			let duration = Number(input_value);
			if (isNaN(duration)) {
				input_value = dates.toDuration(value ?? 0);
			} else {
				if (duration < 1000) duration *= 1000;

				value = duration;
				input_value = dates.toDuration(duration);
			}
		} else if (value) {
			input_value = dates.toDuration(value);
		}
	}
</script>

<Input bind:value={input_value} {id} placeholder="Select duration" {...$$restProps} class={twMerge("rounded", $$restProps.class)}>
	<ClockSolid slot="left" size="sm" class="ms-1" tabindex="-1" />
</Input>
<Dropdown
	bind:open={dropdown_open}
	containerClass="divide-y z-50 rounded"
	class="border rounded border-gray-300 dark:border-gray-600 p-4"
>
	{#if title}
		<DropdownHeader>
			{title}
		</DropdownHeader>
	{/if}
	<DurationControls bind:value />
</Dropdown>
