<script lang="ts">
	import { twMerge } from "tailwind-merge";

	export let tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" = "h3";
</script>

<svelte:element
	this={tag}
	{...$$restProps}
	class={twMerge("font-heading text-[24px]", $$restProps.class)}
>
	<slot />
</svelte:element>
