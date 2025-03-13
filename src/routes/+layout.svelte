<script lang="ts">
	import "../app.css";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";

	import type { PageData } from "./$types";

	import Toaster from "$lib/components/toaster.svelte";
	import { config } from "$lib/config";
	import { AppSchema } from "$lib/seo/schema";

	export let data: PageData;

	onMount(() => {
		if (data.auth_error) {
			toast.error(data.auth_error.message, {
				description: data.auth_error.description,
				important: true,
				duration: 15000
			});
		}
	});
</script>

<svelte:head>
	<script
		defer
		data-domain={config.domain}
		src="https://plausible.io/js/script.tagged-events.js"
	></script>
	<AppSchema />
</svelte:head>

<div class="flex flex-col h-full min-h-screen">
	<div class="flex-1 relative flex flex-col">
		<main class="flex-1">
			<slot />
		</main>
	</div>
</div>
<Toaster theme="dark" />
