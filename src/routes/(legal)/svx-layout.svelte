<script module>
	import a from "./_components/a.svelte";
	import h1 from "./_components/h1.svelte";
	import h2 from "./_components/h2.svelte";
	import h4 from "./_components/h4.svelte";
	import hr from "./_components/hr.svelte";
	import ol from "./_components/ol.svelte";
	import p from "./_components/p.svelte";
	import strong from "./_components/strong.svelte";
	import table from "./_components/table.svelte";
	import tbody from "./_components/tbody.svelte";
	import td from "./_components/td.svelte";
	import th from "./_components/th.svelte";
	import thead from "./_components/thead.svelte";
	import tr from "./_components/tr.svelte";
	import ul from "./_components/ul.svelte";
	// eslint-disable-next-line no-import-assign
	export { a, h1, h2, h4, hr, ol, ul, p, strong, table, thead, tbody, th, tr, td };
</script>

<script lang="ts">
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();
</script>

{@render children()}
