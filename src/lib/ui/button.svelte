<script lang="ts">
	import { emptyMeltElement, melt, type AnyMeltElement } from "@melt-ui/svelte";
	import type { ComponentType } from "svelte";
	import { twMerge } from "tailwind-merge";
	import { tv, type VariantProps } from "tailwind-variants";

	import Icon from "$lib/icons/icon.svelte";

	const variants = tv({
		base: "group/button relative inline-flex justify-center items-center text-center px-[12px] py-[6px]",
		variants: {
			color: {
				primary: "bg-button text-text",
				secondary: "bg-button-secondary text-text",
				destructive: "bg-button-destructive text-text",
				discord: "bg-discord text-text",
				youtube: "bg-youtube text-text",
				patreon: "bg-patreon text-text",
				ghost: "bg-transparent text-text"
			},
			size: {
				sm: "text-[16px]",
				md: "text-[20px]"
			}
		},
		defaultVariants: {
			color: "primary",
			size: "md"
		}
	});

	const icon_sizes = {
		sm: "20px",
		md: "28px"
	};

	type Variant = VariantProps<typeof variants>;

	export let size: Variant["size"] = undefined;
	export let color: Variant["color"] = undefined;
	export let icon: ComponentType<Icon> | undefined = undefined;
	export let iconAlign: "left" | "right" = "right";
	export let type: "submit" | "button" | "reset" = "button";
	export let builder: AnyMeltElement = emptyMeltElement as AnyMeltElement;

	$: icon_padding =
		iconAlign === "right"
			? size === "sm"
				? "pr-[32px]"
				: "pr-[44px]"
			: size === "sm"
				? "pl-[32px]"
				: "pl-[44px]";
</script>

<svelte:element
	this={$$restProps.href ? "a" : "button"}
	role="button"
	tabindex="0"
	use:melt={$builder}
	{...$$restProps}
	{type}
	class={twMerge(variants({ size, color }), icon && icon_padding, $$restProps.class)}
	on:blur
	on:change
	on:click
	on:focus
	on:focusin
	on:focusout
	on:keydown
	on:keypress
	on:keyup
	on:mouseover
	on:mouseenter
	on:mouseleave
>
	{#if color !== "ghost"}
		<div class="absolute left-0 right-0 top-0 w-full h-[4px] bg-white opacity-30"></div>
		<div class="absolute left-0 right-0 bottom-0 w-full h-[4px] bg-black opacity-30"></div>
	{/if}
	<slot />
	{#if icon}
		<svelte:component
			this={icon}
			size={icon_sizes[size ?? "md"]}
			class="absolute top-[50%] translate-y-[-50%] {iconAlign === 'right'
				? 'right-[8px]'
				: 'left-[8px]'}"
		/>
	{/if}
	<div
		class="absolute top-0 left-0 w-full h-full bg-black opacity-20 hidden group-hover/button:block"
	></div>
</svelte:element>
