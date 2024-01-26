<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { Button } from "flowbite-svelte";
	import { TrashBinSolid } from "flowbite-svelte-icons";
	import type { AnyLocation } from "@frcn/shared/locations";
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
		component={LocationOption}
		class="flex-1"
		bind:value
	/>
	{#if deletable}
		<Button
			on:click={(ev) => {
				dispatch("delete", ev);
			}}
			class="aspect-square h-full {disabled
				? 'dark:bg-gray-500'
				: 'dark:bg-red-500'} dark:hover:bg-red-600"
			size="sm"
			{disabled}
		>
			<TrashBinSolid />
		</Button>
	{/if}
</li>
