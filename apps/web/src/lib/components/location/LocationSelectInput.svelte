<script lang="ts">
	import { locations, getChildren, type AnyLocation } from "@frcn/shared/locations";

	import LocationSelectLi from "./LocationSelectLi.svelte";
	import Button from "../Button.svelte";
	import type { Option } from "../select/types";

	const root_options = locations.map((location) => ({
		name: location.name,
		value: location,
	}));

	export let value: AnyLocation[] = [];
	export let disabled = false;
	let li_options: Option<AnyLocation>[][] = [root_options];

	let can_add = false;

	$: {
		if (value.length > li_options.length && value.every((loc) => !!loc)) {
			const refreshed_options: Option<AnyLocation>[][] = [root_options];
			for (const loc of value.slice(0, -1)) {
				const children = getChildren(loc);
				if (!children) break;

				refreshed_options.push(
					children.map((location) => ({
						name: location.name,
						value: location,
					}))
				);
			}

			value = value.slice(0, refreshed_options.length);
			li_options = refreshed_options;
		}

		if (value[0] == undefined && value.length > 1) {
			li_options = [root_options];
			value = [value[0]];
		}

		const last_value = value.slice(-1)[0];
		can_add = last_value && "children" in last_value && value.length == li_options.length;
	}
</script>

<ul class="flex flex-col gap-2" {...$$restProps}>
	{#each li_options as options, i}
		<LocationSelectLi
			{options}
			deletable={i > 0}
			disabled={disabled || i + 1 != li_options.length}
			bind:value={value[i]}
			on:delete={() => {
				if (i + 1 != li_options.length) return;
				li_options = [...li_options.slice(0, -1)];
				value = [...value.slice(0, li_options.length)];
			}}
		/>
	{/each}
	{#if can_add}
		<Button
			{disabled}
			on:click={() => {
				const last_value = value.slice(-1)[0];
				const children = getChildren(last_value);
				if (!children) return;

				li_options = [
					...li_options,
					children.map((location) => ({
						name: location.name,
						value: location,
					})),
				];
			}}>Add Location</Button
		>
	{/if}
</ul>
