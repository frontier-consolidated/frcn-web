<script lang="ts">
	import { page } from "$app/stores";
	import { Alert } from "flowbite-svelte";

	let title = "";
	switch ($page.status) {
		case 404:
			title = "Page Not Found";
			break;
		case 500:
			title = "Server Error";
			break;
		default:
			title = "Unknown Error";
			break;
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<main class="flex flex-1 flex-col p-4 w-full max-w-5xl my-0 mx-auto box-border">
	<Alert color="red">
		<span>{$page.status}: {$page.error?.message}</span>
	</Alert>
</main>
