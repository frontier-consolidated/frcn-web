<script lang="ts">
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();
</script>

<div class="relative flex flex-col mx-auto max-w-3xl pt-24 px-8 text-sm text-text-80">
	{@render children()}
</div>
