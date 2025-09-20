<script lang="ts">
	import { twMerge } from "tailwind-merge";

	export let spanClass = "ms-2";
</script>

<li>
	<button
		{...$$restProps}
		class={twMerge(
			"clip-tl-br-4 flex w-full items-center rounded bg-white px-4 py-1 text-base font-normal text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700",
			$$restProps.class
		)}
		on:blur
		on:click
		on:focus
		on:keydown
		on:keypress
		on:keyup
		on:mouseenter
		on:mouseleave
		on:mouseover
	>
		<slot name="icon" />
		<span class={spanClass}><slot /></span>
	</button>
</li>
