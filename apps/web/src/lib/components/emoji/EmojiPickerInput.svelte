<script lang="ts">
	import { Button } from "flowbite-svelte";
	import { twMerge } from "tailwind-merge";

	import EmojiImage from "./EmojiImage.svelte";
	import EmojiPicker from "./EmojiPicker.svelte";
	import type { Emoji } from "./types";

	export let init: string = "white_check_mark";
	export let additionalEmojis: Emoji[] = [];
	// eslint-disable-next-line no-undef
	export let categoryIcons: Record<string, string | ConstructorOfATypedSvelteComponent> = {};
	export let value: Emoji | null = null;

	let clazz: string | undefined = undefined;
	export { clazz as class };
</script>

<div class="relative">
	<Button
		color="none"
		{...$$restProps}
		class={twMerge("p-1 hover:dark:bg-gray-700 cursor-pointer", clazz)}
	>
		{#if value}
			<EmojiImage emoji={value} class="w-6 h-6" />
		{:else}
			<svg class="w-6 h-6"></svg>
		{/if}
	</Button>
	<EmojiPicker {init} {additionalEmojis} {categoryIcons} bind:value />
</div>
