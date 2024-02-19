<script lang="ts">
	import { dates } from "@frcn/shared";
	import { Input, Dropdown, DropdownHeader } from "flowbite-svelte";
	import { ClockSolid } from "flowbite-svelte-icons";

	import DurationControls from "./duration/DurationControls.svelte";

	export let id: string;
	export let title: string | undefined = undefined;
	export let value: number | null = null;

	let dropdownOpen = false;

	let inputValue: string = "";
	$: {
		if (inputValue && (!value || inputValue != dates.toDuration(value))) {
			let duration = Number(inputValue);
			if (isNaN(duration)) {
				inputValue = dates.toDuration(value ?? 0);
			} else {
				if (duration < 1000) duration *= 1000;

				value = duration;
				inputValue = dates.toDuration(duration);
			}
		} else if (value) {
			inputValue = dates.toDuration(value);
		}
	}
</script>

<Input bind:value={inputValue} {id} placeholder="Select duration" {...$$restProps}>
	<ClockSolid slot="left" size="sm" class="ms-1" tabindex="-1" />
</Input>
<Dropdown
	bind:open={dropdownOpen}
	class="border rounded-lg border-gray-300 dark:border-gray-600 p-4"
>
	{#if title}
		<DropdownHeader>
			{title}
		</DropdownHeader>
	{/if}
	<DurationControls bind:value />
</Dropdown>
