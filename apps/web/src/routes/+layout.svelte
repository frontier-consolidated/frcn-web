<script lang="ts">
	import "../app.css";
	import { Banner } from "flowbite-svelte";

	import Header from "$lib/components/Header.svelte";
	import Notifications from "$lib/components/Notifications.svelte";
</script>

<div class="relative flex flex-col min-h-screen bg-white dark:bg-gray-950">
	<Header></Header>
	<Notifications />
	<Banner id="wip-banner" bannerType="default" classDiv="bg-orange-50 dark:bg-orange-800 text-orange-800 dark:text-orange-400 dark:border-orange-700">
		<span>
			Currently Under Construction
		</span>
	</Banner>
	<slot />
</div>
