<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLOlAttributes } from "svelte/elements";

	let { children, ...rest }: { children: Snippet } & HTMLOlAttributes = $props();
</script>

<ol class="list-decimal list-outside ml-6 mt-2 mb-6" {...rest}>
	{@render children()}
</ol>
