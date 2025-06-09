<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: { children: Snippet } & HTMLAttributes<HTMLTableRowElement> = $props();
</script>

<tr class="border-border border-b-1" {...rest}>
	{@render children()}
</tr>
