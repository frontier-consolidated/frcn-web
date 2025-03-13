<script lang="ts">
	import { createSeparator, melt, type CreateSeparatorProps } from "@melt-ui/svelte";
	import { twMerge } from "tailwind-merge";

	let className: string | undefined = undefined;
	export { className as class };
	export let orientation: CreateSeparatorProps["orientation"] = "horizontal";
	export let decorative: CreateSeparatorProps["decorative"] = true;

	const {
		elements: { root }
	} = createSeparator({
		orientation,
		decorative
	});
</script>

<svelte:element
	this={decorative ? "div" : "hr"}
	use:melt={$root}
	{...$$restProps}
	class={twMerge(
		"shrink-0 border-none bg-background-secondary",
		orientation === "vertical" ? "w-[4px] h-full" : "h-[4px] w-full",
		className
	)}
/>
