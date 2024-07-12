<script lang="ts">
	import { data as defaultEmojis } from "@frcn/shared/emojis";
	import { Button, Dropdown, Search } from "flowbite-svelte";
	import type { ComponentType, SvelteComponent } from "svelte";
	import { twMerge } from "tailwind-merge";

	import EmojiCategoryIcon from "./EmojiCategoryIcon.svelte";
	import EmojiImage from "./EmojiImage.svelte";
	import type { Emoji } from "./types";

	const button_class = "p-1 w-9 h-9 rounded hover:bg-gray-50 dark:hover:bg-gray-800";
	const emoji_class = "w-8 h-8";

	export let init: string | undefined = undefined;
	export let additionalEmojis: Emoji[] = [];
	export let categoryIcons: Record<string, string | ComponentType<SvelteComponent>> = {};
	let emojis = [...additionalEmojis, ...(defaultEmojis.emojis as Emoji[])];
	$: emojis = [...additionalEmojis, ...(defaultEmojis.emojis as Emoji[])];

	function get_emoji_by_id(id: string, emojis: Emoji[]) {
		return emojis.find((emoji) => emoji.id === id || (!emoji.id && emoji.name === id));
	}

	let current_emoji = (init ? get_emoji_by_id(init, emojis) : null) ?? emojis[0];

	export let value: Emoji | null = current_emoji;
	$: if (!value) value = current_emoji;

	let categories: string[];
	let current_category: string = "";

	let search: string | undefined = undefined;
	let tone: number = 0;

	$: {
		const custom_categories: string[] = [];
		for (const emoji of additionalEmojis) {
			if (
				!custom_categories.includes(emoji.category) &&
				!defaultEmojis.categories.includes(emoji.category)
			) {
				custom_categories.push(emoji.category);
			}
		}
		categories = [...custom_categories, ...defaultEmojis.categories];
		if (!current_category) {
			current_category = categories[0];
		}
	}

	function get_emojis_in_category(category: string) {
		return emojis.filter(
			(emoji) => emoji.category === category && (!emoji.tone || emoji.tone === tone)
		);
	}

	function get_emojis_in_search(search?: string) {
		if (!search) return [];
		return emojis
			.filter(
				(emoji) =>
					emoji.name.toLowerCase().includes(search.toLowerCase()) &&
					(!emoji.tone || emoji.tone === tone)
			)
			.slice(0, 9 * 10);
	}

	const active_class =
		"p-2 rounded text-primary-600 bg-gray-100 dark:bg-gray-800 dark:text-primary-500";
	const inactive_class =
		"p-2 rounded text-gray-500 hover:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300";

	let category_divs: Record<string, HTMLElement> = {};
	let category_buttons: Record<string, HTMLElement> = {};

	function init_category(el: HTMLElement) {
		const category = el.dataset.category!;
		category_divs[category] = el;
	}

	function init_category_button(el: HTMLElement) {
		const category = el.dataset.category!;
		category_buttons[category] = el;
	}

	function calculate_current(container: HTMLElement) {
		let current = current_category;
		let current_top = -1;
		for (const category of Object.keys(category_divs)) {
			const div = category_divs[category];
			const div_top = div.offsetTop - container.offsetTop;
			if (container.scrollTop + 20 >= div_top && div_top >= current_top) {
				current_top = div_top;
				current = category;
			}
		}
		current_category = current;
		const button = category_buttons[current_category];
		if (button) {
			button.scrollIntoView();
		}
	}
</script>

<Dropdown {...$$restProps} containerClass="absolute z-50" class="p-1">
	<Search
		bind:value={search}
		placeholder=":{current_emoji.name}:"
		size="sm"
		class="mb-1 sm:text-sm border-transparent dark:border-transparent dark:bg-gray-900"
	/>
	<div class="flex gap-1">
		<ul
			class="shrink-0 flex flex-col p-1 rounded-lg bg-gray-100 dark:bg-gray-900 max-h-72 overflow-y-auto no-scrollbar"
		>
			{#each categories as category}
				{#if category === defaultEmojis.categories[0] && categories.length > defaultEmojis.categories.length}
					<li class="py-2">
						<div class="h-px w-full bg-gray-600"></div>
					</li>
				{/if}
				<li
					data-category={category}
					use:init_category_button
					class="flex justify-center items-center"
				>
					<button
						on:click={() => {
							const div = category_divs[category];
							if (div) {
								div.scrollIntoView({
									inline: "start",
									behavior: "instant",
								});
							}
						}}
						type="button"
						class={twMerge("inline-block text-sm font-medium text-center disabled:cursor-not-allowed", category === current_category ? active_class : inactive_class)}
					>
						<EmojiCategoryIcon {categoryIcons} {category} tabindex="-1" class="w-4 h-4" />
					</button>
				</li>
			{/each}
		</ul>
		<div class="flex flex-col gap-1 max-h-72 h-full">
			<div
				class={twMerge("flex-1 flex flex-col min-h-[16rem] h-64 max-h-64 overflow-y-auto no-scrollbar", search ? undefined : "gap-3")}
				on:scroll={(ev) => calculate_current(ev.currentTarget)}
			>
				<div class={twMerge("grid grid-cols-9", !search ? "hidden" : undefined)}>
					{#each get_emojis_in_search(search) as emoji}
						{#if emoji.svg || emoji.imageUrl}
							<Button
								data-emoji={emoji.id ?? emoji.name}
								color="none"
								class={button_class}
								on:mouseenter={() => (current_emoji = emoji)}
								on:click={() => {
									value = emoji;
								}}
							>
								<EmojiImage {emoji} class={emoji_class} />
							</Button>
						{/if}
					{/each}
				</div>
				{#each categories as category}
					<div data-category={category} use:init_category class={search ? "hidden" : undefined}>
						<div class="px-2 py-1 flex items-center font-medium text-xs text-gray-300">
							<EmojiCategoryIcon {categoryIcons} {category} class="w-3 h-3 me-1" />
							{category.toUpperCase()}
						</div>
						<div class="grid grid-cols-9">
							{#each get_emojis_in_category(category) as emoji}
								{#if emoji.svg || emoji.imageUrl}
									<Button
										data-emoji={emoji.id ?? emoji.name}
										color="none"
										class={button_class}
										on:mouseenter={() => (current_emoji = emoji)}
										on:click={() => {
											value = emoji;
										}}
									>
										<EmojiImage {emoji} class={emoji_class} />
									</Button>
								{/if}
							{/each}
						</div>
					</div>
				{/each}
			</div>
			<div
				class="px-2 flex items-center h-7 w-full rounded-lg text-sm bg-gray-100 dark:bg-gray-900"
			>
				<div class="w-7">
					<EmojiImage emoji={current_emoji} class="w-5 h-5" />
				</div>
				<div class="w-72 ms-1 text-ellipsis text-left overflow-x-hidden">
					{current_emoji.names
						.filter((name) => !/[:;=()]/g.test(name))
						.map((name) => `:${name}:`)
						.join(" ")}
				</div>
			</div>
		</div>
	</div>
</Dropdown>
