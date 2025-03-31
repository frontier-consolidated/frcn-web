<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: { children: Snippet } & HTMLAttributes<HTMLElement> = $props();
</script>

<tbody class="bg-table-body" {...rest}>
	{@render children()}
</tbody>
