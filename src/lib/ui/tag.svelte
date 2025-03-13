<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { twMerge } from "tailwind-merge";

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = HTMLAttributes<HTMLSpanElement>;
</script>

<span
	{...$$restProps}
	class={twMerge(
		"inline-flex items-center px-[4px] py-[2px] text-center align-center font-sans text-[14px] leading-none bg-white text-black",
		$$restProps.class
	)}
>
	<slot />
</span>
