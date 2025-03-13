<script lang="ts">
	import { twMerge } from "tailwind-merge";
	import { tv, type VariantProps } from "tailwind-variants";

	import Label from "./label.svelte";

	import { Search } from "$lib/icons";

	const input_variants = tv({
		base: "flex w-full px-[16px] py-[14px] bg-transparent outline-none file:border-0 file:bg-transparent placeholder:text-text-muted",
		variants: {
			size: {
				md: "text-[14px] placeholder:text-[14px]",
				lg: "text-[16px] placeholder:text-[16px]"
			}
		},
		defaultVariants: {
			size: "md"
		}
	});

	type Variant = VariantProps<typeof input_variants>;

	export let size: Variant["size"] = undefined;

	// Workaround for https://github.com/sveltejs/svelte/issues/9305
	// Fixed in Svelte 5, but not backported to 4.x.
	export let readonly: boolean | null | undefined = undefined;
	export let name: string;
	export let value: any = undefined;
	export let ref: HTMLInputElement | undefined = undefined;

	export let inputClass: string | undefined = undefined;
</script>

<Label for={name} class={twMerge("relative flex items-center w-full bg-input", $$restProps.class)}>
	<input
		{...$$restProps}
		{name}
		{readonly}
		class={twMerge(input_variants({ size }), inputClass)}
		bind:this={ref}
		bind:value
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
		on:paste
		on:input
		on:wheel
	/>
	<button class="p-[8px]">
		<Search size="26px" />
	</button>
	<div class="absolute top-full left-0 w-full h-[4px] bg-border"></div>
</Label>
