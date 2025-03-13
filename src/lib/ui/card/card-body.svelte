<script lang="ts">
	import { twMerge } from "tailwind-merge";
</script>

<div
	{...$$restProps}
	class={twMerge("flex-1 flex flex-col gap-[8px] px-[20px] py-[12px]", $$restProps.class)}
>
	<slot />
</div>
