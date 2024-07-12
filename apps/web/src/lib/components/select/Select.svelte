<script lang="ts">
	import { Badge, Dropdown, DropdownItem } from "flowbite-svelte";
	import { AngleDownSolid, CloseSolid } from "flowbite-svelte-icons";
	import { getContext } from "svelte";
	import { twMerge } from "tailwind-merge";

	import type { Option } from "./types";

	const search_class = "flex-1 bg-transparent border-transparent w-full text-sm focus:outline-none";

	// eslint-disable-next-line no-undef
	type T = $$Generic;
	// eslint-disable-next-line no-undef
	type S = $$Generic<Record<string, any>>;
	// eslint-disable-next-line no-undef
	type Multi = $$Generic<boolean>;

	export let id: string | undefined = undefined;
	export let placeholder = "Choose option ...";
	export let disabled: boolean = false;
	export let options: Option<T, S>[] = [];
	export let multi: Multi = false as Multi;
	export let search: boolean = false;
	export let max: number | undefined = undefined;

	let clazz: string = "";
	export { clazz as class };

	let search_input: string = "";
	let last_search_input: string = search_input;
	let dropdown_open = false;

	type Value = (Multi extends true ? T[] : T | undefined);

	export let value: Value = (multi ? [] : undefined) as Value;

	function get_selected_options(multi: boolean, value: Value, options: Option<T, S>[]) {
		if (multi) {
			if (!Array.isArray(value)) return [];
			const selected = options.filter(option => value.includes(option.value));
			const indexed = selected.map(option => ({ option, index: value.indexOf(option.value) }));
			indexed.sort((a, b) => a.index - b.index);
			return indexed.map(idx => idx.option);
		} else {
			if (value === undefined) return [];
			const option = options.find(opt => opt.value === value);
			if (!option) return [];
			return [option];
		}
	}

	$: selectedOptions = get_selected_options(multi, value, options);
	$: selectableOptions = (multi ? (!max || selectedOptions.length < max) ? options.filter(option => !(value as T[]).includes(option.value)) : [] : options).filter(option => !search_input || option.name.toLowerCase().includes(search_input));


	let input: HTMLInputElement | null = null;
	function init_input(el: HTMLInputElement) {
		input = el;
	}
	
	$: {
		if (search_input != last_search_input) {
			last_search_input = search_input;
			dropdown_open = true;
			if (search_input && !multi) {
				value = undefined as Value;
			}
		}
	}
	$: if (search && input && dropdown_open) input.focus();

	function select_option(option: Option<T, S>) {
		dropdown_open = multi;
		search_input = "";
		last_search_input = "";
		if (multi) {
			if (!Array.isArray(value)) return;
			if (!value.includes(option.value)) {
				value = [...value, option.value] as Value;
			} else {
				value = value.filter(v => v !== option.value) as Value;
			}
		} else {
			value = option.value as Value;
		}
		if (multi && input) input.focus();
	}

	function remove_option(option: Option<T, S>) {
		if (!multi || !Array.isArray(value)) return;
		value = (value as T[]).filter(v => v !== option.value) as Value;
		if (input) input.focus();
	}

	function on_input_keydown(ev: KeyboardEvent) {
		if (ev.key === "Backspace") {
			if (multi && Array.isArray(value)) {
				value = value.slice(0, -1) as Value;
			} else {
				value = undefined as Value;
			}
		}
	}

	let background = getContext("background");
</script>

<div {id} class={twMerge("relative w-full", clazz)}>
	<select {disabled} hidden id="{id}-select" {...$$restProps}>
		{#each options as option}
			<option value={option.name}>{option.name}</option>
		{/each}
	</select>
	<div
		aria-disabled={disabled}
		tabindex="-1"
		role="listbox"
		class={twMerge("flex items-center w-full text-gray-900 dark:text-white bg-gray-50 border border-gray-300 rounded text-sm p-2.5 min-h-[3rem]", background ? "dark:bg-gray-600 dark:border-gray-500" : "dark:bg-gray-700 dark:border-gray-600", disabled ? "cursor-not-allowed opacity-50" : "focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500")}
	>
		<span class="flex flex-wrap gap-1 w-full">
			{#if selectedOptions.length > 0}
				{#if multi}
					{#each selectedOptions as option}
						<Badge color="none">
							<slot {option}>
								<span>{option.name}</span>
							</slot>
							<button class="focus:outline-none whitespace-normal m-0.5 rounded-sm focus:ring-1 p-0.5 ms-1.5 -me-1.5" on:click={() => remove_option(option)}>
								<span class="sr-only">Remove {option.name}</span>
								<CloseSolid class="w-2.5 h-2.5" tabindex="-1" />
							</button>
						</Badge>
					{/each}
					{#if !disabled && search}
						<input class={search_class} use:init_input bind:value={search_input} on:keydown={on_input_keydown} />
					{/if}
				{:else}
					<slot option={selectedOptions[0]}>
						<span>{selectedOptions[0].name}</span>
					</slot>
					{#if !disabled && search}
						<input class={search_class} use:init_input bind:value={search_input} on:keydown={on_input_keydown} />
					{/if}
				{/if}
			{:else}
				{#if !disabled && search}
					<input {placeholder} class={search_class} use:init_input bind:value={search_input} on:keydown={on_input_keydown} />
				{:else}
					<span>{placeholder}</span>
				{/if}
			{/if}
		</span>
		<div class="flex ms-auto items-center">
			<AngleDownSolid size="xs" class="cursor-pointer ms-1 text-gray-500" tabindex="-1" />
		</div>
	</div>
	{#if !disabled && selectableOptions.length > 0}
		<Dropdown
			containerClass="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded border border-gray-300 dark:border-gray-600 divide-gray-100 dark:divide-gray-600 shadow-md divide-y z-50 w-full cursor-pointer overflow-y-scroll max-h-64"
			class="rounded"
			bind:open={dropdown_open}
		>
			<DropdownItem disabled defaultClass="font-medium py-2 px-4 text-sm text-gray-500"
				>{placeholder}</DropdownItem
			>
			{#each selectableOptions as option}
				{#key option}
					<DropdownItem
						on:click={() => {
							select_option(option);
						}}
					>
						<slot {option}>
							<span>{option.name}</span>
						</slot>
					</DropdownItem>
				{/key}
			{/each}
		</Dropdown>
	{/if}
</div>
