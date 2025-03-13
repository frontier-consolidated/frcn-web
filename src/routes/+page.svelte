<script lang="ts">
	import type { PageData } from "./$types";
	import Private from "./_private.svelte";
	import Public from "./_public.svelte";

	import Meta from "$lib/seo/meta.svelte";

	export let data: PageData;
</script>

<Meta />
