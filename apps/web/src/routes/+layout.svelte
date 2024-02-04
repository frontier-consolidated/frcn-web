<script lang="ts">
	import "../app.css";
	import { Banner } from "flowbite-svelte";
	import { CodeSolid } from "flowbite-svelte-icons";

	import CookieConsentModal from "$lib/components/CookieConsentModal.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import Header from "$lib/components/Header.svelte";
	import Notifications from "$lib/components/Notifications.svelte";
</script>

<svelte:head>
	<meta name="theme-color" content="#1784F2">
</svelte:head>

<div class="main-container relative flex flex-col min-h-screen bg-white dark:bg-gray-950">
	<Header />
	<Banner id="wip-banner" bannerType="default" classDiv="bg-orange-50 dark:bg-orange-800 text-orange-800 dark:text-orange-400 dark:border-orange-700">
		<CodeSolid class="me-2" /> Currently Under Construction
	</Banner>
	<slot />
	<Footer />
	<CookieConsentModal />
	<Notifications />
</div>

<style>
	.main-container {
		background-image: url("$lib/images/background.svg");
		background-attachment: fixed;
		background-size: cover;
	}
</style>