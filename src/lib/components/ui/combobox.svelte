<script lang="ts" generics="TOption extends { name: string }, Multiple extends boolean">
	import { ChevronDownIcon } from "lucide-svelte";
	import { Combobox } from "melt/builders";
	import type { HTMLInputAttributes } from "svelte/elements";
	import type { SvelteSet } from "svelte/reactivity";
	import { twMerge } from "tailwind-merge";
	import { tv, type VariantProps } from "tailwind-variants";

	import ClippedShape from "../clipped-shape.svelte";
	import ScrollArea from "./scroll-area.svelte";

	const variants = tv({
		base: "relative flex w-full pl-4 pr-8 py-3 outline-hidden placeholder:text-input-placeholder",
		variants: {
			size: {
				base: "text-[14px] font-medium placeholder:text-[14px]",
				lg: "text-[16px] placeholder:text-[16px]"
			}
		}
	});

	const optionVariants = tv({
		base: "p-2 bg-white/0 hover:bg-white/5 data-[highlighted='true']:bg-white/5 transition-colors cursor-pointer",
		variants: {
			size: {
				base: "text-[14px] font-medium",
				lg: "text-[16px]"
			}
		}
	});

	type Variant = VariantProps<typeof variants>;

	type Props = {
		class?: string;
		"outer-class"?: string;
		value?: Multiple extends true ? SvelteSet<TOption> : TOption | undefined;
		options: TOption[];
		multiple?: Multiple;
	} & Variant &
		Omit<HTMLInputAttributes, "size">;

	let {
		size = "base",
		class: className,
		"outer-class": outerClass,
		value = $bindable(),
		options,
		multiple,
		placeholder = "Select",
		id,
		...rest
	}: Props = $props();

	const combobox = new Combobox<TOption["name"], Multiple>({
		multiple
	});

	const resolvedId = $derived(id ?? combobox.ids.input);

	const filteredOptions = $derived.by(() => {
		if (!combobox.touched) return options;
		return options.filter((opt) =>
			opt.name.toLowerCase().includes(combobox.inputValue.trim().toLowerCase())
		);
	});
</script>

<div class={twMerge("relative h-fit", outerClass)}>
	<ClippedShape
		class="absolute top-0 left-0 w-full h-full"
		corners="none small"
		bg="--color-input"
		border="--color-input-border"
	></ClippedShape>
	<input
		{...combobox.input}
		id={resolvedId}
		{placeholder}
		{...rest}
		class={twMerge(variants({ size }), className)}
		onfocus={() => (combobox.open = true)}
	/>
	<ChevronDownIcon
		{...combobox.trigger}
		class="absolute top-0 bottom-0 right-2 my-auto size-5 cursor-pointer transition-opacity hover:opacity-70"
	/>

	<div {...combobox.content} class="relative bg-transparent rounded-[3px] overflow-hidden">
		<ClippedShape
			class="absolute top-0 left-0 w-full h-full"
			corners="none small"
			bg="--color-background-secondary"
			border="--color-input-border"
		></ClippedShape>
		<ScrollArea
			id="{resolvedId}-scroll-area"
			direction="Y"
			class="relative flex flex-col text-text max-h-64"
		>
			{#each filteredOptions as option (option.name)}
				<div {...combobox.getOption(option.name)} class={optionVariants({ size })}>
					{option.name}
				</div>
			{/each}
		</ScrollArea>
	</div>
</div>
