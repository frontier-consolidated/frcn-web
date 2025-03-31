<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: { children: Snippet } & HTMLAttributes<HTMLParagraphElement> =
		$props();
</script>

<p class="mb-4" {...rest}>
	{@render children()}
</p>
