<script lang="ts">
	import type { Emoji } from "./types";

	export let emoji: Emoji;
	let clazz: string | undefined = undefined;
	export { clazz as class };
</script>

{#if emoji.imageUrl}
	<img
		width="36"
		height="36"
		src={emoji.imageUrl}
		alt={emoji.name}
		{...$$restProps}
		class="aspect-square object-contain {clazz ?? ''}"
	/>
{:else if emoji.svg}
	<svg
		width="36"
		height="36"
		viewBox="0 0 36 36"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...$$restProps}
		class={clazz}
	>
		{@html emoji.svg}
	</svg>
{/if}
