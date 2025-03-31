<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLTdAttributes } from "svelte/elements";

	let { children, ...rest }: { children: Snippet } & HTMLTdAttributes = $props();
</script>

<td class="p-2" {...rest}>
	{@render children()}
</td>
