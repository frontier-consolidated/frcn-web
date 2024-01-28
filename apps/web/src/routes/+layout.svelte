<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/Header.svelte";
	import Notifications from "$lib/components/Notifications.svelte";
</script>

<div class="relative flex flex-col min-h-screen bg-white dark:bg-gray-950">
	<Header></Header>
	<Notifications />
	<slot />
</div>
