<script lang="ts">
	import { Button } from "flowbite-svelte";
	import EmojiPicker from "./EmojiPicker.svelte";
	import EmojiImage from "./EmojiImage.svelte";
	import type { Emoji } from "./types";

	export let init: string = "white_check_mark";
	export let additionalEmojis: Emoji[] = [];
	export let value: Emoji | null = null;

	let clazz: string | undefined = undefined;
	export { clazz as class };
</script>

<div class="relative">
	<Button
		color="none"
		{...$$restProps}
		class="p-1 hover:dark:bg-gray-700 cursor-pointer {clazz ?? ''}"
	>
		{#if value}
			<EmojiImage emoji={value} class="w-6 h-6" />
		{:else}
			<svg class="w-6 h-6"></svg>
		{/if}
	</Button>
	<EmojiPicker {init} {additionalEmojis} bind:value />
</div>
