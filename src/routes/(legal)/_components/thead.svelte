<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: { children: Snippet } & HTMLAttributes<HTMLElement> = $props();
</script>

<thead class="bg-table-head text-text-80" {...rest}>
	{@render children()}
</thead>
