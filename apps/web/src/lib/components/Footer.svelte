<script lang="ts">
	import {
		Footer,
		FooterBrand,
		FooterCopyright,
		FooterIcon,
		FooterLink,
		FooterLinkGroup
	} from "flowbite-svelte";
	import {
		DiscordSolid,
		GithubSolid,
		MoonSolid,
		SunSolid,
		YoutubeSolid
	} from "flowbite-svelte-icons";
	import type { ComponentType, SvelteComponent } from "svelte";

	import { DISCORD_URL, GITHUB_URL, YOUTUBE_URL } from "$lib/constants";
	import logo from "$lib/images/logo.png";
	import madeByTheCommunity from "$lib/images/mbtc.png";
	import { cookieConsentModal } from "$lib/stores/CookieConsentModalStore";

	import Hr from "./Hr.svelte";
	import ScreenQuery from "./utils/ScreenQuery.svelte";

	const socials = [
		{ href: YOUTUBE_URL, name: "Youtube", icon: YoutubeSolid },
		{ href: DISCORD_URL, name: "Discord", icon: DiscordSolid },
		{ href: GITHUB_URL, name: "GitHub", icon: GithubSolid }
	] satisfies { href: string; name: string; icon: ComponentType<SvelteComponent> }[];
</script>

<Footer
	footerType="socialmedia"
	class="relative mt-12 flex flex-col items-center bg-zinc-200 dark:bg-gray-900"
>
	<div
		class="clip-tl-8 absolute -top-[1.9rem] right-0 h-8 w-[40%] bg-zinc-200 dark:bg-gray-900"
	></div>
	<div class="mt-4 w-full max-w-6xl gap-8 md:flex md:justify-between">
		<div class="mb-6 flex shrink-0 md:mb-0 md:flex-col">
			<ScreenQuery size="sm" let:matches>
				<FooterBrand
					href="/"
					src={logo}
					alt="Frontier Consolidated Logo"
					name={matches ? "Frontier Consolidated" : "FRCN"}
					classImg="drop-shadow"
					classSpan="text-gray-700"
				/>
			</ScreenQuery>
		</div>
		<div class="grid gap-8 min-[380px]:grid-cols-2 sm:grid-cols-3 sm:gap-6">
			<div>
				<h2 class="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
					Quick Links
				</h2>
				<FooterLinkGroup>
					<FooterLink liClass="mb-2" href="/">Home</FooterLink>
					<FooterLink liClass="mb-2" href="/about/activities">Activities</FooterLink>
					<FooterLink liClass="mb-2" href="/about/community">Community</FooterLink>
					<FooterLink liClass="mb-2" href="/about/org">Organisation</FooterLink>
					<FooterLink liClass="mb-2" href="/events">Events</FooterLink>
					<FooterLink liClass="mb-2" href="/resources">Guides & Resources</FooterLink>
				</FooterLinkGroup>
			</div>
			<div>
				<h2 class="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">Social</h2>
				<FooterLinkGroup>
					{#each socials as social (social.href)}
						<FooterLink liClass="mb-2" href={social.href} target="_blank">{social.name}</FooterLink>
					{/each}
				</FooterLinkGroup>
			</div>
			<div>
				<h2 class="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">Legal</h2>
				<FooterLinkGroup>
					<FooterLink liClass="mb-2" href="/legal/privacy">Privacy Policy</FooterLink>
					<li class="mb-2">
						<button
							class="hover:underline"
							on:click={() => {
								cookieConsentModal.set(true);
							}}>Cookie Settings</button
						>
					</li>
					<FooterLink liClass="mb-2" href="/legal/cookies">Cookie Policy</FooterLink>
				</FooterLinkGroup>
			</div>
		</div>
	</div>
	<Hr class="my-8 w-full bg-gray-300" />
	<div class="flex w-full max-w-6xl flex-col gap-4 md:flex-row md:items-center">
		<img
			src={madeByTheCommunity}
			alt="Made by the Star Citizen community"
			class="mx-auto aspect-square w-16 md:mx-0"
		/>
		<div class="max-w-xl">
			<FooterCopyright
				href="/"
				by="Frontier Consolidated"
				spanClass="block text-sm text-gray-500 dark:text-gray-400"
			/>
			<span class="block text-xs text-gray-500 dark:text-gray-400"
				>This is an unofficial Star Citizen site, not affiliated with the Cloud Imperium group of
				companies. All content on this site not authored by its host or users are property of their
				respective owners.</span
			>
		</div>
		<div class="relative flex space-x-6 pr-16 md:ml-auto md:justify-center rtl:space-x-reverse">
			{#each socials as social (social.href)}
				<FooterIcon href={social.href} target="_blank">
					<svelte:component
						this={social.icon}
						class="h-4 w-4 text-gray-500 outline-none hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"
						tabindex="-1"
						ariaLabel={social.name}
					/>
				</FooterIcon>
			{/each}
			<button
				class="absolute bottom-0 right-0 top-0 z-40 my-auto h-[180%] rounded p-1 hover:bg-gray-400/30"
				on:click={() => {
					if (document.documentElement.classList.contains("dark")) {
						document.documentElement.classList.remove("dark");
					} else {
						document.documentElement.classList.add("dark");
					}
				}}
			>
				<SunSolid class="hidden h-full text-gray-400 dark:block" tabindex="-1" />
				<MoonSolid class="h-full text-gray-600 dark:hidden" tabindex="-1" />
			</button>
		</div>
	</div>
</Footer>
