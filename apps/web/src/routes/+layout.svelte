<script lang="ts">
	import "../app.css";
	import { Banner } from "flowbite-svelte";
	import { CodeSolid } from "flowbite-svelte-icons";

	import CookieConsentModal from "$lib/components/CookieConsentModal.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import Header from "$lib/components/Header.svelte";
	import Notifications from "$lib/components/Notifications.svelte";
	import UserProfileModal from "$lib/components/UserProfileModal.svelte";
</script>

<svelte:head>
	<meta name="theme-color" content="#1784F2">
</svelte:head>

<div class="main-container font-fractul relative flex flex-col min-h-screen bg-white dark:bg-gray-950">
	<div class="fixed top-0 left-0 w-full z-20">
		<Header />
		<Banner id="wip-banner" bannerType="default" classDiv="z-20 bg-orange-50 dark:bg-orange-800 text-orange-800 dark:text-orange-400 dark:border-orange-700">
			<CodeSolid class="me-2" tabindex="-1" /> Currently Under Construction
		</Banner>
	</div>
	<slot />
	<Footer />
	<UserProfileModal />
	<CookieConsentModal />
	<Notifications />
</div>

<style>
	.main-container {
		background-image: url("$lib/images/background.svg");
		background-size: cover;
	}
</style>