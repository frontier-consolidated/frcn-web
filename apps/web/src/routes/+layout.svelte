<script lang="ts">
	import "../app.css";
	import { navigating } from "$app/stores";
	import { Banner, Spinner } from "flowbite-svelte";
	import { CodeSolid } from "flowbite-svelte-icons";

	import { CookieConsentModal, Footer, Header, Notifications, UserProfileModal } from "$lib/components";
	import JoinGuildModal from "$lib/components/modals/JoinGuildModal.svelte";

	let showSpinner = false;
	// eslint-disable-next-line no-undef
	let spinnerTimeout: NodeJS.Timeout | null = null; 
	$: {
		if (!showSpinner && !spinnerTimeout && $navigating) {
			spinnerTimeout = setTimeout(() => {
				if ($navigating) showSpinner = true;
				spinnerTimeout = null;
			}, 200)
		} else if (showSpinner && !$navigating) {
			showSpinner = false;
		}
	}
</script>

<svelte:head>
	<meta name="theme-color" content="#1784F2">
</svelte:head>

<div class="bg-triangle-pattern bg-cover font-fractul relative flex flex-col min-h-screen bg-white dark:bg-gray-950">
	<div class="fixed top-0 left-0 w-full z-20">
		<Header />
		<Banner id="wip-banner" bannerType="default" classDiv="z-20 bg-orange-50 dark:bg-orange-800 text-orange-800 dark:text-orange-400 dark:border-orange-700">
			<CodeSolid class="me-2" tabindex="-1" /> Currently Under Construction
		</Banner>
	</div>
	{#if showSpinner}
		<main class="flex-1 flex flex-col w-full box-border justify-center items-center">
			<Spinner />
		</main>
	{:else}
		<main class="flex flex-1 flex-col w-full box-border">	
			<slot />
		</main>
		<Footer />
	{/if}
	<UserProfileModal />
	<JoinGuildModal />
	<CookieConsentModal />
	<Notifications />
</div>
