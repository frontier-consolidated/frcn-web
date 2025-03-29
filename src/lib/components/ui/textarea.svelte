<script lang="ts" generics="T">
	import type { HTMLTextareaAttributes } from "svelte/elements";
	import { twMerge } from "tailwind-merge";
	import { tv, type VariantProps } from "tailwind-variants";

	import ClippedShape from "../clipped-shape.svelte";

	const variants = tv({
		base: "relative flex w-full px-4 py-3 outline-hidden placeholder:text-input-placeholder",
		variants: {
			size: {
				base: "text-[14px] font-medium placeholder:text-[14px]",
				lg: "text-[16px] placeholder:text-[16px]"
			}
		}
	});

	type Variant = VariantProps<typeof variants>;

	type Props = {
		class?: string;
		"outer-class"?: string;
		value?: T;
		ref?: HTMLTextAreaElement | undefined;
	} & Variant &
		HTMLTextareaAttributes;

	let {
		size = "base",
		class: className,
		"outer-class": outerClass,
		value = $bindable(),
		ref = $bindable(),
		...rest
	}: Props = $props();
</script>

<div class={twMerge("relative", outerClass)}>
	<ClippedShape
		class="absolute top-0 left-0 w-full h-full"
		corners="none small"
		bg="--color-input"
		border="--color-input-border"
	></ClippedShape>
	<textarea {...rest} class={twMerge(variants({ size }), className)} bind:this={ref} bind:value
	></textarea>
</div>
