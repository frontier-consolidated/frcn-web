<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: { children: Snippet } & HTMLAttributes<HTMLUListElement> = $props();
</script>

<ul class="mt-2 mb-6 ml-4 list-outside list-disc" {...rest}>
	{@render children()}
</ul>
