<script lang="ts">
	import { twMerge } from "tailwind-merge";
</script>

<hr {...$$restProps} class={twMerge("h-px my-2 bg-gray-200 border-0 dark:bg-gray-700", $$restProps.class)} />