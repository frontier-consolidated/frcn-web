<script lang="ts">
	import type { Component, ComponentType, Snippet, SvelteComponentTyped } from "svelte";
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
	import { twMerge } from "tailwind-merge";
	import { tv, type VariantProps } from "tailwind-variants";

	import ClippedShape, { type CornersConfig } from "../clipped-shape.svelte";

	const variants = tv({
		base: "group/button relative cursor-pointer disabled:cursor-not-allowed",
		variants: {
			color: {
				primary: "text-text [--s-button-bg:var(--color-button)]",
				secondary: "text-text [--s-button-bg:var(--color-button-secondary)]",
				ghost: "text-text [--s-button-bg:var(--color-text)]",
				text: "text-text-80 hover:text-text transition-colors",
				destructive: "text-text [--s-button-bg:var(--color-button-destructive)]",
				discord: "text-text [--s-button-bg:var(--color-discord)]"
			},
			size: {
				sm: "text-sm font-medium",
				base: "text-base font-medium",
				lg: "text-base font-semibold"
			},
			corners: {
				none: "p-2",
				small: "px-[14px] py-2",
				large: "px-24px py-2",
				"small none": "py-2 pr-2 pl-[14px]",
				"none small": "py-2 pr-[14px] pl-2",
				"small small": "px-[14px] py-2",
				"small large": "py-2 pr-[24px] pl-[14px]",
				"large none": "py-2 pr-2 pl-[24px]",
				"none large": "py-2 pr-[24px] pl-2",
				"large small": "py-2 pr-[14px] pl-[24px]",
				"large large": "px-[24px] py-2"
			} satisfies Record<CornersConfig, string>
		},
		compoundVariants: [
			{
				size: "lg",
				corners: ["small", "small small"],
				class: "px-[calc(var(--spacing)*2+14px)] py-3"
			}
		]
	});

	type Variant = VariantProps<typeof variants>;

	const backgroundVariants = tv({
		base: "absolute top-0 left-0 h-full w-full group-hover/button:transition-opacity",
		variants: {
			color: {
				primary: "group-hover/button:opacity-80",
				secondary: "opacity-60 group-hover/button:opacity-70",
				ghost: "opacity-0 group-hover/button:opacity-5",
				text: "",
				destructive: "group-hover/button:opacity-80",
				discord: "group-hover/button:opacity-80"
			} satisfies typeof variants.variants.color
		}
	});

	const iconVariants = tv({
		variants: {
			size: {
				sm: "size-5",
				base: "size-6",
				lg: "size-7"
			} satisfies typeof variants.variants.size
		}
	});

	type Props = {
		type?: "submit" | "button" | "reset";
		class?: string;
		"inner-class"?: string;
		Icon?: Component<{ class?: string }> | ComponentType<SvelteComponentTyped<{ class?: string }>>;
		iconProps?: Record<string, any>;
		icon?: Snippet<[string]>;
		"icon-class"?: string;
		"icon-align"?: "left" | "right";
		nobackground?: boolean;
		children: Snippet;
	} & Variant &
		(({ href: string } & HTMLAnchorAttributes) | ({ href?: undefined } & HTMLButtonAttributes));

	let {
		href,
		type = "button",
		class: className,
		"inner-class": innerClass,
		color = "primary",
		size = "base",
		corners = "small",
		Icon,
		iconProps,
		icon,
		"icon-class": iconClass,
		"icon-align": iconAlign = "left",
		nobackground,
		children,
		...rest
	}: Props = $props();

	const iconClasses = $derived(twMerge(iconVariants({ size }), iconClass));
</script>

<svelte:element
	this={href ? "a" : "button"}
	{href}
	role="button"
	tabindex="0"
	{type}
	class={twMerge(variants({ size, color, corners }), className)}
	{...rest}
>
	{#if !nobackground}
		<ClippedShape class={twMerge(backgroundVariants({ color }))} {corners} bg="--s-button-bg" />
	{/if}
	<div class={twMerge("relative flex items-center gap-2", innerClass)}>
		{#if Icon && iconAlign === "left"}
			<Icon {...iconProps} class={iconClasses} />
		{:else if icon && iconAlign === "left"}
			{@render icon(iconClasses)}
		{/if}
		{@render children()}
		{#if Icon && iconAlign === "right"}
			<Icon {...iconProps} class={iconClasses} />
		{:else if icon && iconAlign === "right"}
			{@render icon(iconClasses)}
		{/if}
	</div>
</svelte:element>
