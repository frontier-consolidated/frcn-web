<script lang="ts">
	import { createLabel, melt } from "@melt-ui/svelte";
	import type { HTMLLabelAttributes } from "svelte/elements";
	import { twMerge } from "tailwind-merge";

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = HTMLLabelAttributes;

	const {
		elements: { root }
	} = createLabel();
</script>

<label
	use:melt={$root}
	{...$$restProps}
	class={twMerge("mb-[4px] leading-none", $$restProps.class)}
>
	<slot />
</label>
