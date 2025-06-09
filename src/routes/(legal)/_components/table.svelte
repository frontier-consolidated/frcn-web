<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLTableAttributes } from "svelte/elements";

	let { children, ...rest }: { children: Snippet } & HTMLTableAttributes = $props();
</script>

<div class="w-full overflow-x-auto">
	<table class="text-text min-w-full overflow-hidden rounded-[3px]" {...rest}>
		{@render children()}
	</table>
</div>
