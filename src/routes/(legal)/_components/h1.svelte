<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: { children: Snippet } & HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h1 class="text-text text-4xl md:text-5xl font-medium mb-3" {...rest}>
	{@render children()}
</h1>
