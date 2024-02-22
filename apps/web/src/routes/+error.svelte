<script lang="ts">
	import { page } from "$app/stores";
	import { Alert, Button, Heading } from "flowbite-svelte";

	import Hr from "$lib/components/Hr.svelte";
	import { login } from "$lib/stores/UserStore";

	let title = "";
	$: switch ($page.status) {
		case 404:
			title = "Page Not Found";
			break;
		case 401:
			title = "Unauthenticated"
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
	<title>{$page.status} - {title}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="flex flex-1 flex-col p-4 w-full max-w-5xl my-0 mx-auto box-border">
	{#if $page.status === 401}
		<div class="my-auto py-16">
			<div class="flex flex-col items-center rounded-lg p-6 bg-gray-900 border-2 border-red-800 border-dashed">
				<Heading tag="h1" class="font-medium text-4xl text-center">Access Denied</Heading>
				<p class="text-gray-500">{$page.status}</p>
				<Hr class="w-full" />
				<p class="mt-4 text-gray-400">You must be authenticated in order to view this page</p>
				<div class="flex justify-center mt-4">
					<Button on:click={() => {
						login().catch(console.error)
					}}>Login</Button>
				</div>
			</div>
		</div>
	{:else}
		<Alert color="red">
			<span>{$page.status}: {$page.error?.message}</span>
		</Alert>
	{/if}
</main>
