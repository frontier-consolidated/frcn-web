<script lang="ts">
	import { Heading } from "flowbite-svelte";
	import { RotateOutline } from "flowbite-svelte-icons";

	import { page } from "$app/stores";
	import { Button, Head, LoginButton } from "$lib/components";

	let heading = "Critical Error";
	let status = $page.error?.status ?? $page.status;
	$: switch (status) {
		case 401:
			heading = "Access Denied";
			break;
		case 404:
			heading = "Page Not Found";
			break;
		case 429:
			heading = "Overloaded";
			break;
		default:
			heading = "Server Error";
			break;
	}
</script>

<Head title={status.toString()} description={heading}>
	<meta name="robots" content="noindex" />
</Head>

<div class="mx-auto my-0 box-border flex w-full max-w-3xl flex-1 flex-col p-4">
	<div class="h-screen pt-[20vh]">
		<div class="flex flex-col">
			<div class="relative w-max">
				<div class="animate-glow clip-br-8 rounded px-4 py-1 pr-10">
					<Heading
						tag="h1"
						class="text-center text-2xl font-medium text-white min-[400px]:text-3xl sm:text-4xl"
						>{heading}</Heading
					>
				</div>
				<div class="animate-glow absolute -right-[0rem] bottom-0 h-8 w-2 skew-x-[-45deg]"></div>
				<div class="animate-glow absolute -right-[1rem] bottom-0 h-8 w-2 skew-x-[-45deg]"></div>
				<div class="animate-glow absolute -right-[2rem] bottom-0 h-8 w-2 skew-x-[-45deg]"></div>
			</div>
			<p class="pl-2 text-gray-500">Error code: {status}</p>
			<div
				class="clip-tl-br-reverse-8 mt-4 flex flex-col items-center bg-gray-50 p-6 dark:bg-gray-800"
			>
				{#if status === 401}
					<p class="text-gray-500 dark:text-gray-400">
						You must be authenticated in order to view this page
					</p>
					<div class="mt-4 flex justify-center">
						<LoginButton />
					</div>
				{:else if status === 404}
					<p class="text-gray-500 dark:text-gray-400">
						We could not find the page you were looking for.
					</p>
					<div class="mt-4 flex justify-center">
						<Button href="/">BACK TO SAFETY</Button>
					</div>
				{:else if status === 429}
					<p class="text-gray-500 dark:text-gray-400">
						Slow down! Sending too many requests to server, please try again later.
					</p>
					<div class="mt-4 flex justify-center">
						<Button
							on:click={() => {
								window.location.reload();
							}}
						>
							<RotateOutline class="me-2" /> RETRY
						</Button>
					</div>
				{:else}
					<p class="text-gray-500 dark:text-gray-400">
						We encountered an issue with your request, please try again later.
					</p>
					<div class="mt-4 flex justify-center">
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
		0%,
		100% {
			background-color: theme("colors.red.600");
		}
		50% {
			background-color: theme("colors.red.500");
		}
	}
</style>
