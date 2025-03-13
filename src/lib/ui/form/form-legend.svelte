<script lang="ts">
	import * as FormSnap from "formsnap";
	import { twMerge } from "tailwind-merge";

	type $$Props = FormSnap.LegendProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<FormSnap.Legend
	{...$$restProps}
	class={twMerge("mb-[4px] leading-none data-[fs-error]:text-text-destructive", className)}
	let:legendAttrs
>
	<slot {legendAttrs} />
</FormSnap.Legend>
