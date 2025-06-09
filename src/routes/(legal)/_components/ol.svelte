<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLOlAttributes } from "svelte/elements";

	let { children, ...rest }: { children: Snippet } & HTMLOlAttributes = $props();
</script>

<ol class="mt-2 mb-6 ml-6 list-outside list-decimal" {...rest}>
	{@render children()}
</ol>
