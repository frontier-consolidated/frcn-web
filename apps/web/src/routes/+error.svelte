<script lang="ts">
	import { page } from "$app/stores";
	import { Heading } from "flowbite-svelte";

	import { Button, Head, LoginButton } from "$lib/components";

	let heading = "Critical Error";
	$: switch ($page.status) {
		case 401:
			heading = "Access Denied";
			break;
		case 404:
			heading = "Page Not Found";
			break;
		default:
			heading = "Server Error";
			break;
	}
</script>

<Head
	title={$page.status.toString()}
	description={heading}
>
	<meta name="robots" content="noindex" />
</Head>

<div class="flex flex-1 flex-col p-4 w-full max-w-3xl my-0 mx-auto box-border">
	<div class="h-screen pt-[20vh]">
		<div class="flex flex-col">
			<div class="relative w-max">
				<div class="rounded animate-glow px-4 py-1 pr-10 clip-br-8">
					<Heading tag="h1" class="font-medium text-2xl min-[400px]:text-3xl sm:text-4xl text-center text-white">{heading}</Heading>
				</div>
				<div class="absolute bottom-0 -right-[0rem] skew-x-[-45deg] h-8 w-2 animate-glow"></div>
				<div class="absolute bottom-0 -right-[1rem] skew-x-[-45deg] h-8 w-2 animate-glow"></div>
				<div class="absolute bottom-0 -right-[2rem] skew-x-[-45deg] h-8 w-2 animate-glow"></div>
			</div>
			<p class="pl-2 text-gray-500">Error code: {$page.status}</p>
			<div class="flex flex-col items-center mt-4 p-6 bg-gray-50 dark:bg-gray-800 clip-opposite-reverse-8">
				{#if $page.status === 401}
					<p class="text-gray-500 dark:text-gray-400">You must be authenticated in order to view this page</p>
					<div class="flex justify-center mt-4">
						<LoginButton />
					</div>
				{:else if $page.status === 404}
					<p class="text-gray-500 dark:text-gray-400">We could not find the page you were looking for.</p>
					<div class="flex justify-center mt-4">
						<Button href="/">BACK TO SAFETY</Button>
					</div>
				{:else}
					<p class="text-gray-500 dark:text-gray-400">We encountered an issue with your request, please try again later.</p>
					<div class="flex justify-center mt-4">
						<Button href="/">BACK TO SAFETY</Button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.animate-glow {
		animation: glow 2s infinite;
	}

	@keyframes glow {
		0%, 100% {
			background-color: theme("colors.red.600");
		}
		50% {
			background-color: theme("colors.red.500");
		}
	}
</style>