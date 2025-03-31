<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLThAttributes } from "svelte/elements";

	let { children, ...rest }: { children: Snippet } & HTMLThAttributes = $props();
</script>

<th class="p-2" {...rest}>
	{@render children()}
</th>
