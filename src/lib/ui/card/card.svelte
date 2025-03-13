<script lang="ts">
	import { emptyMeltElement, melt } from "@melt-ui/svelte";
	import { twMerge } from "tailwind-merge";

	const sizes = {
		full: "max-w-none",
		sm: "max-w-[360px]",
		md: "max-w-[480px]",
		lg: "max-w-[648px]"
	};

	export let tag: "div" | "article" | "section" | "a" = "div";
	export let innerClass: string | undefined = undefined;
	export let size: keyof typeof sizes = "md";
	export let melt_el: Parameters<typeof melt>[1] = $emptyMeltElement;
</script>

<svelte:element
	this={tag}
	use:melt={melt_el}
	{...$$restProps}
	class={twMerge("relative flex flex-col w-[calc(100%-8px)]", sizes[size], $$restProps.class)}
>
	<div class="absolute inset-[-4px] bg-border z-[-1]"></div>
	<div class={twMerge("flex-1 flex flex-col w-full bg-card", innerClass)}>
		<slot />
	</div>
</svelte:element>
