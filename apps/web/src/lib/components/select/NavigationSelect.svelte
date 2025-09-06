<script lang="ts">
	import { Dropdown, DropdownItem } from "flowbite-svelte";
	import { AngleDownSolid } from "flowbite-svelte-icons";
	import { getContext } from "svelte";
	import { twMerge } from "tailwind-merge";

	import { goto } from "$app/navigation";

	import type { NavigationOption, OptionGroup } from "./types";

	// eslint-disable-next-line no-undef
	type S = $$Generic<Record<string, any>>;

	function flattenOptions(options: (NavigationOption<S> | OptionGroup<NavigationOption<S>>)[]) {
		let flattened: NavigationOption<S>[] = [];
		for (const opt of options) {
			if ("options" in opt) {
				flattened = flattened.concat(opt.options);
			} else {
				flattened.push(opt);
			}
		}
		return flattened;
	}

	function getOptionGroups(options: (NavigationOption<S> | OptionGroup<NavigationOption<S>>)[]) {
		let groups: OptionGroup<NavigationOption<S>>[] = [];
		for (const opt of options) {
			if ("options" in opt) {
				groups.push(opt);
			}
		}
		return groups;
	}

	function getLooseOptions(options: (NavigationOption<S> | OptionGroup<NavigationOption<S>>)[]) {
		let opts: NavigationOption<S>[] = [];
		for (const opt of options) {
			if ("options" in opt) continue;
			opts.push(opt);
		}
		return opts;
	}

	export let activeUrl: string | undefined = undefined;
	export let placeholder = "None";
	export let options: (NavigationOption<S> | OptionGroup<NavigationOption<S>>)[] = [];
	let clazz = "";
	export { clazz as class };

	$: currentOption = flattenOptions(options).find((opt) => opt.href === activeUrl);

	let background = getContext("background");
</script>

<div class={twMerge("relative w-full", clazz)}>
	<select hidden {...$$restProps}>
		{#each options as option (option.name)}
			<option value={option.name}>{option.name}</option>
		{/each}
	</select>
	<div
		tabindex="-1"
		role="listbox"
		class={twMerge(
			"focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 flex min-h-[3rem] w-full items-center rounded border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:text-white",
			background ? "dark:border-gray-500 dark:bg-gray-600" : "dark:border-gray-600 dark:bg-gray-700"
		)}
	>
		<span class="flex w-full flex-wrap gap-1">
			{#if currentOption}
				<slot option={currentOption}>
					<span>{currentOption.name}</span>
				</slot>
			{:else}
				<span>{placeholder}</span>
			{/if}
		</span>
		<div class="ms-auto flex items-center">
			<AngleDownSolid size="xs" class="ms-1 cursor-pointer text-gray-500" tabindex="-1" />
		</div>
	</div>
	<Dropdown
		containerClass="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded border border-gray-300 dark:border-gray-600 divide-gray-100 dark:divide-gray-600 shadow-md divide-y z-50 w-full cursor-pointer overflow-y-scroll max-h-64"
		class="rounded"
	>
		{#each getOptionGroups(options) as group (group.name)}
			<li class="mb-2 w-full text-left text-sm font-medium">
				<span class="text-md block p-2 font-semibold">{group.name}</span>
				<ul class="border-t border-gray-300 dark:border-gray-600">
					{#each group.options as option (option)}
						<DropdownItem
							class="pl-6"
							on:click={() => {
								goto(option.href);
							}}
						>
							<slot {option}>
								<span>{option.name}</span>
							</slot>
						</DropdownItem>
					{/each}
				</ul>
			</li>
		{/each}
		{#each getLooseOptions(options) as option (option)}
			<DropdownItem
				on:click={() => {
					goto(option.href);
				}}
			>
				<slot {option}>
					<span>{option.name}</span>
				</slot>
			</DropdownItem>
		{/each}
	</Dropdown>
</div>
