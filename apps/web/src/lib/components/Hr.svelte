<script lang="ts">
	import { twMerge } from "tailwind-merge";
</script>

<hr
	{...$$restProps}
	class={twMerge("my-2 h-px border-0 bg-gray-200 dark:bg-gray-700", $$restProps.class)}
/>
