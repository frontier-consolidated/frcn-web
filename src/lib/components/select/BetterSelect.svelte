<script lang="ts">
	import { Dropdown, DropdownItem } from "flowbite-svelte";
	import { AngleDownSolid } from "flowbite-svelte-icons";
	import type { Option } from "./types";

	export let placeholder = "Choose option ...";
	export let disabled: boolean = false;
	export let options: Option[] = [];
	export let component: any = undefined;

	export let value: unknown | undefined = undefined;
	let selectedOption: Option | undefined = options.find((option) => option.value == value);
	$: value = selectedOption ? selectedOption.value : undefined;

	let dropdownOpen = false;
</script>

<div class="relative w-full {$$restProps.class ?? ''}">
	<select {disabled} hidden {...$$restProps}>
		{#each options as option}
			<option value={option.name}>{option.name}</option>
		{/each}
	</select>
	<div
		aria-disabled={disabled}
		tabindex="-1"
		role="listbox"
		class="flex items-center w-full text-gray-900 bg-gray-50 border border-gray-300 rounded-lg {!disabled
			? 'focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500'
			: ''} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:{disabled
			? 'text-gray-400'
			: 'text-white'} text-sm p-2.5 min-h-[3rem]"
	>
		<span class="flex">
			{#key selectedOption}
				{#if selectedOption}
					{#if component}
						<svelte:component this={component} {value} />
					{:else}
						<span>{selectedOption.name}</span>
					{/if}
				{:else}
					<span>{placeholder}</span>
				{/if}
			{/key}
		</span>
		<div class="flex ms-auto items-center">
			<AngleDownSolid size="xs" class="cursor-pointer ms-1 text-gray-500" />
		</div>
	</div>
	{#if !disabled}
		<Dropdown
			bind:open={dropdownOpen}
			containerClass="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 divide-gray-100 dark:divide-gray-600 shadow-md divide-y z-50 w-full cursor-pointer overflow-y-scroll max-h-64"
		>
			<DropdownItem disabled defaultClass="font-medium py-2 px-4 text-sm text-gray-500"
				>{placeholder}</DropdownItem
			>
			{#each options as option}
				<DropdownItem
					on:click={() => {
						dropdownOpen = false;
						selectedOption = option;
					}}
				>
					{#if component}
						<svelte:component this={component} value={option.value} />
					{:else}
						<span>{option.name}</span>
					{/if}
				</DropdownItem>
			{/each}
		</Dropdown>
	{/if}
</div>
