<script lang="ts">
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();
</script>

<div class="text-text-80 relative mx-auto flex max-w-3xl flex-col px-8 pt-24 text-sm">
	{@render children()}
</div>
