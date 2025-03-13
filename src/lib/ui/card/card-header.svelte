<script lang="ts">
	import { twMerge } from "tailwind-merge";
</script>

<div
	{...$$restProps}
	class={twMerge(
		"relative flex justify-center w-full p-[13px] mb-[8px] leading-none bg-background-secondary",
		$$restProps.class
	)}
>
	<div class="absolute top-full left-0 w-full h-[4px] bg-border"></div>
	<slot />
</div>
