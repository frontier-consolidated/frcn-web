<script lang="ts">
	import { data as defaultEmojis } from "@frcn/shared/emojis";
	import { Button, Dropdown, Search } from "flowbite-svelte";
	import { twMerge } from "tailwind-merge";

	import EmojiCategoryIcon from "./EmojiCategoryIcon.svelte";
	import EmojiImage from "./EmojiImage.svelte";
	import type { Emoji } from "./types";

	const buttonClass = "p-1 w-9 h-9 rounded hover:bg-gray-50 dark:hover:bg-gray-800";
	const emojiClass = "w-8 h-8";

	export let init: string | undefined = undefined;
	export let additionalEmojis: Emoji[] = [];
	// eslint-disable-next-line no-undef
	export let categoryIcons: Record<string, string | ConstructorOfATypedSvelteComponent> = {}
	let emojis = [...additionalEmojis, ...(defaultEmojis.emojis as Emoji[])];
	$: emojis = [...additionalEmojis, ...(defaultEmojis.emojis as Emoji[])];

	function getEmojiById(id: string, emojis: Emoji[]) {
		return emojis.find((emoji) => emoji.id === id || (!emoji.id && emoji.name === id));
	}

	let currentEmoji = (init ? getEmojiById(init, emojis) : null) ?? emojis[0];

	export let value: Emoji | null = currentEmoji;
	$: if (!value) value = currentEmoji;

	let categories: string[];
	let currentCategory: string = "";

	let search: string | undefined = undefined;
	let tone: number = 0;

	$: {
		const customCategories: string[] = [];
		for (const emoji of additionalEmojis) {
			if (
				!customCategories.includes(emoji.category) &&
				!defaultEmojis.categories.includes(emoji.category)
			) {
				customCategories.push(emoji.category);
			}
		}
		categories = [...customCategories, ...defaultEmojis.categories];
		if (!currentCategory) {
			currentCategory = categories[0];
		}
	}

	function getEmojisInCategory(category: string) {
		return emojis.filter(
			(emoji) => emoji.category === category && (!emoji.tone || emoji.tone === tone)
		);
	}

	function getEmojisInSearch(search?: string) {
		if (!search) return [];
		return emojis
			.filter(
				(emoji) =>
					emoji.name.toLowerCase().includes(search.toLowerCase()) &&
					(!emoji.tone || emoji.tone === tone)
			)
			.slice(0, 9 * 10);
	}

	const activeClass =
		"p-2 rounded text-primary-600 bg-gray-100 dark:bg-gray-800 dark:text-primary-500";
	const inactiveClass =
		"p-2 rounded text-gray-500 hover:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300";

	let categoryDivs: Record<string, HTMLElement> = {};
	let categoryButtons: Record<string, HTMLElement> = {};

	function initCategory(el: HTMLElement) {
		const category = el.dataset.category!;
		categoryDivs[category] = el;
	}

	function initCategoryButton(el: HTMLElement) {
		const category = el.dataset.category!;
		categoryButtons[category] = el;
	}

	function calculateCurrent(container: HTMLElement) {
		let current = currentCategory;
		let currentTop = -1;
		for (const category of Object.keys(categoryDivs)) {
			const div = categoryDivs[category];
			const divTop = div.offsetTop - container.offsetTop;
			if (container.scrollTop + 20 >= divTop && divTop >= currentTop) {
				currentTop = divTop;
				current = category;
			}
		}
		currentCategory = current;
		const button = categoryButtons[currentCategory];
		if (button) {
			button.scrollIntoView();
		}
	}
</script>

<Dropdown {...$$restProps} containerClass="absolute z-50" class="p-1">
	<Search
		bind:value={search}
		placeholder=":{currentEmoji.name}:"
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
					use:initCategoryButton
					class="flex justify-center items-center"
				>
					<button
						on:click={() => {
							const div = categoryDivs[category];
							if (div) {
								div.scrollIntoView({
									inline: "start",
									behavior: "instant",
								});
							}
						}}
						type="button"
						class={twMerge("inline-block text-sm font-medium text-center disabled:cursor-not-allowed", category === currentCategory ? activeClass : inactiveClass)}
					>
						<EmojiCategoryIcon {categoryIcons} {category} tabindex="-1" class="w-4 h-4" />
					</button>
				</li>
			{/each}
		</ul>
		<div class="flex flex-col gap-1 max-h-72 h-full">
			<div
				class={twMerge("flex-1 flex flex-col min-h-[16rem] h-64 max-h-64 overflow-y-auto no-scrollbar", search ? undefined : "gap-3")}
				on:scroll={(ev) => calculateCurrent(ev.currentTarget)}
			>
				<div class={twMerge("grid grid-cols-9", !search ? "hidden" : undefined)}>
					{#each getEmojisInSearch(search) as emoji}
						{#if emoji.svg || emoji.imageUrl}
							<Button
								data-emoji={emoji.id ?? emoji.name}
								color="none"
								class={buttonClass}
								on:mouseenter={() => (currentEmoji = emoji)}
								on:click={() => {
									value = emoji;
								}}
							>
								<EmojiImage {emoji} class={emojiClass} />
							</Button>
						{/if}
					{/each}
				</div>
				{#each categories as category}
					<div data-category={category} use:initCategory class={search ? "hidden" : undefined}>
						<div class="px-2 py-1 flex items-center font-medium text-xs text-gray-300">
							<EmojiCategoryIcon {categoryIcons} {category} class="w-3 h-3 me-1" />
							{category.toUpperCase()}
						</div>
						<div class="grid grid-cols-9">
							{#each getEmojisInCategory(category) as emoji}
								{#if emoji.svg || emoji.imageUrl}
									<Button
										data-emoji={emoji.id ?? emoji.name}
										color="none"
										class={buttonClass}
										on:mouseenter={() => (currentEmoji = emoji)}
										on:click={() => {
											value = emoji;
										}}
									>
										<EmojiImage {emoji} class={emojiClass} />
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
					<EmojiImage emoji={currentEmoji} class="w-5 h-5" />
				</div>
				<div class="w-72 ms-1 text-ellipsis text-left overflow-x-hidden">
					{currentEmoji.names
						.filter((name) => !/[:;=()]/g.test(name))
						.map((name) => `:${name}:`)
						.join(" ")}
				</div>
			</div>
		</div>
	</div>
</Dropdown>
