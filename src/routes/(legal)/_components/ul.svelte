<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: { children: Snippet } & HTMLAttributes<HTMLUListElement> = $props();
</script>

<ul class="list-disc list-outside ml-4 mt-2 mb-6" {...rest}>
	{@render children()}
</ul>
