<script module>
	import a from "./_components/a.svelte";
	import h1 from "./_components/h1.svelte";
	import h2 from "./_components/h2.svelte";
	import h4 from "./_components/h4.svelte";
	import hr from "./_components/hr.svelte";
	import ol from "./_components/ol.svelte";
	import p from "./_components/p.svelte";
	import strong from "./_components/strong.svelte";
	import ul from "./_components/ul.svelte";
	// eslint-disable-next-line no-import-assign
	export { a, h1, h2, h4, hr, ol, ul, p, strong };
</script>

<script lang="ts">
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();
</script>

{@render children()}
