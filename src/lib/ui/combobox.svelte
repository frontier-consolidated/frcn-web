<script
	lang="ts"
	generics="T extends { name: string, group?: string, disabled?: boolean }, M extends boolean"
>
	import {
		melt,
		createCombobox,
		type ComboboxOptionProps,
		type CreateComboboxProps
	} from "@melt-ui/svelte";
	import { createEventDispatcher } from "svelte";
	import { fly } from "svelte/transition";
	import VirtualList from "svelte-tiny-virtual-list";
	import { twMerge } from "tailwind-merge";
	import { tv, type VariantProps } from "tailwind-variants";

	import Tag from "./tag.svelte";

	import { ArrowUp, ArrowDown, Close } from "$lib/icons";

	const dispatch = createEventDispatcher();

	// eslint-disable-next-line no-undef
	const to_melt_option = (option: T): ComboboxOptionProps<T> => ({
		value: option,
		label: option.name,
		disabled: option.disabled
	});

	const input_variants = tv({
		base: "flex w-full px-[16px] py-[14px] pr-[40px] bg-transparent outline-none file:border-0 file:bg-transparent placeholder:text-text-muted",
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
	export let name: string | undefined = undefined;

	export let inputClass: string | undefined = undefined;
	// eslint-disable-next-line no-undef
	export let options: T[];
	// eslint-disable-next-line no-undef
	export let optionHeight: number | ((option: T, index: number, options: T[]) => number) = 40;
	// eslint-disable-next-line no-undef
	export let multiple: M = false as M;
	// eslint-disable-next-line no-undef
	export let value: (M extends true ? T[] : T) | null | undefined = undefined;
	export let closeOnOutsideClick = true;
	export let keepInput = false;
	export let showSelected = false;
	// eslint-disable-next-line no-undef
	export let onSelectedChange: CreateComboboxProps<T, M>["onSelectedChange"] = undefined;

	const {
		elements: { menu, input, option, label },
		states: { open, inputValue, touchedInput, selected },
		helpers: { isSelected }
	} = createCombobox({
		forceVisible: true,
		multiple,
		closeOnOutsideClick,
		name,
		defaultSelected: (Array.isArray(value)
			? value.map(to_melt_option)
			: value) as CreateComboboxProps<T, M>["defaultSelected"], // eslint-disable-line no-undef
		onOpenChange(open) {
			if (open.curr !== open.next) {
				dispatch("open", open.next);
			}
			return open.next;
		},
		onSelectedChange
	});

	$: {
		if (Array.isArray($selected)) {
			// eslint-disable-next-line no-undef
			value = $selected.map((option) => option.value as T) as M extends true ? T[] : T;
		} else if (!$selected && multiple) {
			// eslint-disable-next-line no-undef
			value = [] as unknown as M extends true ? T[] : T;
		} else {
			// eslint-disable-next-line no-undef
			value = $selected?.value as (M extends true ? T[] : T) | undefined;
		}
	}

	$: if (!$open && !keepInput) {
		$inputValue = Array.isArray(value) ? "" : (value?.name ?? "");
	}

	$: if (multiple) {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		$selected;
		$inputValue = "";
	}

	// eslint-disable-next-line no-undef
	let values: T[];
	// eslint-disable-next-line no-undef
	let filteredOptions: T[];
	$: {
		if (keepInput && $inputValue) {
			$touchedInput = true;
		}

		// eslint-disable-next-line no-undef
		values = (Array.isArray(value) ? value : value ? [value] : []) as T[];
		filteredOptions = (
			$touchedInput
				? options.filter((option) => {
						const normalizedInput = $inputValue.toLowerCase().trim();
						if (normalizedInput.startsWith("@")) {
							const inGroupInput = normalizedInput.slice(1).trim();
							const inQuotes = /^["']/.test(inGroupInput);
							let [group, name] = inQuotes
								? inGroupInput.split(/(?<=["'].+["']) (.*)/s)
								: inGroupInput.split(/ (.*)/s);

							if (inQuotes) {
								group = group.slice(1, -1);
							}
							return (
								(inQuotes
									? option.group?.toLowerCase() === group
									: option.group?.toLowerCase().includes(group)) &&
								(!name || option.name.toLowerCase().includes(name))
							);
						}
						return option.name.toLowerCase().includes(normalizedInput);
					})
				: options
		).filter((option) => showSelected || !values.some((val) => val.name === option.name));
	}

	let input_ref: HTMLInputElement;
	function input_init(node: HTMLInputElement) {
		input_ref = node;
	}

	function remove_item(index: number) {
		if (!Array.isArray($selected)) return;
		const copy = [...$selected];
		copy.splice(index, 1);
		$selected = copy as typeof $selected;
	}

	function remove_last_item() {
		if (!multiple || values.length === 0) return;
		$selected = (Array.isArray($selected) ? $selected.slice(0, -1) : undefined) as typeof $selected;
	}
</script>

<label
	use:melt={$label}
	class={twMerge(
		"relative flex flex-col justify-center w-full mb-[4px] leading-none bg-input",
		$$restProps.class
	)}
>
	{#if multiple && values.length > 0}
		<div class="flex flex-wrap gap-[4px] px-[16px] pt-[14px] pr-[40px]">
			{#each values as val, index}
				<Tag class="gap-[2px]">
					<span>{val.name}</span>
					<button type="button" on:click={() => remove_item(index)}>
						<Close size="12px" />
					</button>
				</Tag>
			{/each}
		</div>
	{/if}
	<input
		use:melt={$input}
		use:input_init
		{...$$restProps}
		{name}
		{readonly}
		class={twMerge(
			input_variants({ size }),
			multiple && values.length > 0 && "pt-[8px]",
			inputClass
		)}
		on:blur
		on:change
		on:click
		on:focus
		on:focusin
		on:focusout
		on:keypress
		on:keyup
		on:mouseover
		on:mouseenter
		on:mouseleave
		on:paste
		on:input
		on:wheel
		on:keydown={(e) => {
			if (e.key === "Backspace" && !e.currentTarget.value) {
				remove_last_item();
			}
		}}
	/>
	<button
		type="button"
		class="absolute top-0 right-0 p-[8px]"
		on:click={() => {
			if ($open) {
				$open = false;
			} else {
				input_ref.focus();
				input_ref.click();
				$open = true;
			}
		}}
	>
		{#if $open}
			<ArrowUp size="26px" />
		{:else}
			<ArrowDown size="26px" />
		{/if}
	</button>
	<div class="absolute top-full left-0 w-full h-[4px] bg-border"></div>
</label>
{#if $open}
	<ul
		class="flex flex-col max-h-[300px] mt-[-4px] overflow-hidden z-10 bg-input px-[4px] pb-[4px]"
		use:melt={$menu}
		transition:fly={{ duration: 150, y: -5 }}
	>
		{#if filteredOptions.length > 100}
			<VirtualList
				width="100%"
				height={300}
				itemCount={filteredOptions.length}
				itemSize={(index) => {
					if (typeof optionHeight === "number") return optionHeight;
					return optionHeight(filteredOptions[index], index, filteredOptions);
				}}
			>
				<div slot="item" let:index let:style {style}>
					{@const o = filteredOptions[index]}
					{@const is_selected = $isSelected(o)}
					{@const builder = $option(to_melt_option(o))}
					<slot {builder} option={o} selected={is_selected}>
						<li
							use:melt={builder}
							class="relative cursor-pointer p-[8px] bg-background-secondary data-[highlighted]:bg-button-secondary"
						>
							<span>{o.name}</span>
						</li>
					</slot>
				</div>
			</VirtualList>
		{:else}
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div class="flex max-h-full flex-col overflow-y-auto" tabindex="0">
				{#each filteredOptions as o, index (index)}
					{@const is_selected = $isSelected(o)}
					{@const builder = $option(to_melt_option(o))}
					<slot {builder} option={o} selected={is_selected}>
						<li
							use:melt={builder}
							class="relative cursor-pointer p-[8px] bg-background-secondary data-[highlighted]:bg-button-secondary"
						>
							<span>{o.name}</span>
						</li>
					</slot>
				{:else}
					<li class="relative cursor-pointer p-[4px]">No results found</li>
				{/each}
			</div>
		{/if}
	</ul>
{/if}
