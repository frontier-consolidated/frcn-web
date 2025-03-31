<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAnchorAttributes } from "svelte/elements";

	let { children, ...rest }: { children: Snippet } & HTMLAnchorAttributes = $props();
</script>

<a class="text-text-link hover:underline" {...rest}>
	{@render children()}
</a>
