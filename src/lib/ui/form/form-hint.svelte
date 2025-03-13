<script lang="ts">
	import * as FormSnap from "formsnap";
	import type { HTMLAttributes } from "svelte/elements";
	import { twMerge } from "tailwind-merge";

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = HTMLAttributes<HTMLSpanElement>;
</script>

<FormSnap.Description
	{...$$restProps}
	class={twMerge("text-[12px] text-text-muted", $$restProps.class)}
	let:descriptionAttrs
>
	<slot {descriptionAttrs} />
</FormSnap.Description>
