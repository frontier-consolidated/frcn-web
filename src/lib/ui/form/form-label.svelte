<script lang="ts">
	import { getFormControl } from "formsnap";
	import type { HTMLLabelAttributes } from "svelte/elements";
	import { twMerge } from "tailwind-merge";

	import Label from "../label.svelte";

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = HTMLLabelAttributes;

	const { labelAttrs } = getFormControl();
</script>

<Label
	{...$labelAttrs}
	{...$$restProps}
	class={twMerge("data-[fs-error]:text-text-destructive", $$restProps.class)}
>
	<slot {labelAttrs} />
</Label>
