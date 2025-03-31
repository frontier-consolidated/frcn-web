<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLTableAttributes } from "svelte/elements";

	let { children, ...rest }: { children: Snippet } & HTMLTableAttributes = $props();
</script>

<div class="w-full overflow-x-auto">
	<table class="min-w-full rounded-[3px] text-text overflow-hidden" {...rest}>
		{@render children()}
	</table>
</div>
