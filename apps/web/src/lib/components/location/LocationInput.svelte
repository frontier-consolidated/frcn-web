<script lang="ts">
	import { type AnyLocation } from "@frcn/shared/locations";
	import { Input } from "flowbite-svelte";
	import { twMerge } from "tailwind-merge";
	import LocationInputModal from "./LocationInputModal.svelte";
	import Button from "../Button.svelte";

	export let id: string;
	export let value: AnyLocation[] = [];
	export let disabled = false;

	let modalOpen = false;
</script>

<div class={twMerge("flex gap-2", $$restProps.class)}>
	<Input
		{disabled}
		readonly
		value={value.length ? value.map((loc) => loc.name).join(" > ") : null}
		{id}
		placeholder="Select location"
		{...$$restProps}
		class="flex-1 overflow-x-hidden text-ellipsis rounded"
		on:click={() => {
			if (disabled) return;
			modalOpen = true;
		}}
	/>
	<Button
		{disabled}
		color="dark"
		on:click={() => {
			value = [];
		}}
	>
		Clear
	</Button>
</div>

<LocationInputModal bind:open={modalOpen} bind:value />
