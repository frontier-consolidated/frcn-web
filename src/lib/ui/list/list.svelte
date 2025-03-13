<script lang="ts">
	import { twMerge } from "tailwind-merge";

	const lists = {
		ol: "list-decimal",
		ul: "list-[square]"
	};

	export let tag: "ul" | "ol" = "ul";
</script>

<svelte:element
	this={tag}
	{...$$restProps}
	class={twMerge(
		"list-outside pl-[16px] leading-none space-y-[4px]",
		lists[tag],
		$$restProps.class
	)}
>
	<slot />
</svelte:element>
