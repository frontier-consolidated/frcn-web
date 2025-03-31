<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: { children: Snippet } & HTMLAttributes<HTMLTableRowElement> = $props();
</script>

<tr class="border-b-1 border-border" {...rest}>
	{@render children()}
</tr>
