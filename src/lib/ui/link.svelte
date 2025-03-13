<script lang="ts">
	import { emptyMeltElement, melt, type AnyMeltElement } from "@melt-ui/svelte";
	import { twMerge } from "tailwind-merge";

	export let tag: "a" | "button" = "a";
	export let builder: AnyMeltElement = emptyMeltElement as AnyMeltElement;
</script>

<svelte:element
	this={tag}
	use:melt={$builder}
	{...$$restProps}
	class={twMerge("underline", $$restProps.class)}
>
	<slot />
</svelte:element>
