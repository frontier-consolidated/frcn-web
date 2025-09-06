<script lang="ts">
	import "../app.css";
	import { Spinner } from "flowbite-svelte";

	import { browser } from "$app/environment";
	import { navigating } from "$app/stores";
	import {
		CookieConsentModal,
		Footer,
		Header,
		Notifications,
		UserProfileModal
	} from "$lib/components";
	import JoinGuildModal from "$lib/components/modals/JoinGuildModal.svelte";

	let showSpinner = false;
	// eslint-disable-next-line no-undef
	let spinnerTimeout: NodeJS.Timeout | null = null;
	$: {
		if (browser && !showSpinner && !spinnerTimeout && $navigating) {
			spinnerTimeout = setTimeout(() => {
				if ($navigating) showSpinner = true;
				spinnerTimeout = null;
			}, 200);
		} else if (showSpinner && !$navigating) {
			showSpinner = false;
		}
	}
</script>

<svelte:head>
	<meta name="theme-color" content="#1784F2" />
	<script
		defer
		data-domain="frontierconsolidated.com"
		src="https://plausible.io/js/script.js"
	></script>
</svelte:head>

<div
	class="bg-triangle-pattern font-fractul relative flex min-h-screen flex-col bg-white bg-cover dark:bg-gray-950"
>
	<div class="fixed left-0 top-0 z-20 w-full">
		<Header />
		<!-- <Banner id="wip-banner" bannerType="default" classDiv="z-20 bg-orange-50 dark:bg-orange-800 text-orange-800 dark:text-orange-400 dark:border-orange-700">
			<CodeSolid class="me-2" tabindex="-1" /> Currently Under Construction
		</Banner> -->
	</div>
	{#if showSpinner}
		<main class="box-border flex w-full flex-1 flex-col items-center justify-center">
			<Spinner />
		</main>
	{:else}
		<main class="box-border flex w-full flex-1 flex-col">
			<slot />
		</main>
		<Footer />
	{/if}
	<UserProfileModal />
	<JoinGuildModal />
	<CookieConsentModal />
	<Notifications />
</div>
