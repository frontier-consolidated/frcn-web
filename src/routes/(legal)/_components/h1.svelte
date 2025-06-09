<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: { children: Snippet } & HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h1 class="text-text mb-3 text-4xl font-medium md:text-5xl" {...rest}>
	{@render children()}
</h1>
