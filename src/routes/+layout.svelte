<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/Header.svelte";
</script>

<div class="flex flex-col min-h-screen bg-white dark:bg-gray-950">
	<Header></Header>

	<slot />
</div>
