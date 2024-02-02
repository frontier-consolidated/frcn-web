<script lang="ts">
	import type { AnyLocation } from "@frcn/shared/locations";
	import { Button } from "flowbite-svelte";
	import { TrashBinSolid } from "flowbite-svelte-icons";
	import { createEventDispatcher } from "svelte";
	import { twMerge } from "tailwind-merge";

	import BetterSelect from "$lib/components/select/BetterSelect.svelte";
	import type { Option } from "$lib/components/select/types";

	import LocationOption from "./LocationOption.svelte";

	const dispatch = createEventDispatcher();

	export let deletable: boolean = true;
	export let disabled: boolean = false;
	export let value: AnyLocation;
	export let options: Option<AnyLocation>[];
</script>

<li class="flex gap-2 h-12">
	<BetterSelect
		{options}
		{disabled}
		placeholder="Choose location ..."
		class="flex-1"
		search
		bind:value
		let:option
	>
		<LocationOption value={option.value} />
	</BetterSelect>
	{#if deletable}
		<Button
			on:click={(ev) => {
				dispatch("delete", ev);
			}}
			class={twMerge("aspect-square h-full dark:hover:bg-red-600", disabled ? "dark:bg-gray-500" : "dark:bg-red-500")}
			size="sm"
			{disabled}
		>
			<TrashBinSolid />
		</Button>
	{/if}
</li>
