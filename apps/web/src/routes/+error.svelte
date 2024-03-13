<script lang="ts">
	import { page } from "$app/stores";
	import { Button, Heading } from "flowbite-svelte";

	import { Hr } from "$lib/components";
	import { login } from "$lib/stores/UserStore";
</script>

<svelte:head>
	<title>{$page.status} | Frontier Consolidated</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="flex flex-1 flex-col p-4 w-full max-w-5xl my-0 mx-auto box-border">
	<div class="h-screen pt-[20vh]">
		<div class="flex flex-col items-center rounded-lg p-6 bg-gray-900 border-2 border-red-800 border-dashed">
			{#if $page.status === 401}
				<Heading tag="h1" class="font-medium text-4xl text-center">Access Denied</Heading>
				<p class="text-gray-500">Error code: {$page.status}</p>
				<Hr class="w-full" />
				<p class="mt-4 text-gray-400">You must be authenticated in order to view this page</p>
				<div class="flex justify-center mt-4">
					<Button class="rounded-none clip-opposite-3" on:click={() => {
						login().catch(console.error)
					}}>LOGIN</Button>
				</div>
			{:else if $page.status === 404}
				<Heading tag="h1" class="font-medium text-4xl text-center">Page Not Found</Heading>
				<p class="text-gray-500">Error code: {$page.status}</p>
				<Hr class="w-full" />
				<p class="mt-4 text-gray-400">We could not find the page you were looking for.</p>
				<div class="flex justify-center mt-4">
					<Button href="/" class="rounded-none clip-opposite-3">BACK TO SAFETY</Button>
				</div>
			{:else}
				<Heading tag="h1" class="font-medium text-4xl text-center">Server Error</Heading>
				<p class="text-gray-500">Error code: {$page.status}</p>
				<Hr class="w-full" />
				<p class="mt-4 text-gray-400">We encountered and issue with your request, please try again later.</p>
				<div class="flex justify-center mt-4">
					<Button href="/" class="rounded-none clip-opposite-3">BACK TO SAFETY</Button>
				</div>
			{/if}
		</div>
	</div>
</main>
