<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: { children: Snippet } & HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h2 class="text-text text-2xl font-medium mt-8 mb-4" {...rest}>
	{@render children()}
</h2>
