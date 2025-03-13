<script lang="ts">
	import { createCheckbox, melt } from "@melt-ui/svelte";
	import { twMerge } from "tailwind-merge";

	import { Close } from "$lib/icons";

	let className: string | undefined = undefined;
	export { className as class };
	export let defaultChecked: boolean | "indeterminate" | undefined = undefined;

	const {
		elements: { root, input },
		helpers: { isChecked }
	} = createCheckbox({
		defaultChecked
	});
</script>

<button
	use:melt={$root}
	class={twMerge(
		"relative flex appearance-none items-center justify-center size-[28px] bg-input",
		className
	)}
	{...$$restProps}
>
	{#if $isChecked}
		<Close class="size-[24px]" />
	{/if}
	<div class="absolute top-full left-0 w-full h-[4px] bg-border"></div>
	<input use:melt={$input} />
</button>
