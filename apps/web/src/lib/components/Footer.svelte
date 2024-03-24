<script lang="ts">
	import { Footer, FooterBrand, FooterCopyright, FooterIcon, FooterLink, FooterLinkGroup } from "flowbite-svelte";
	import { DiscordSolid, GithubSolid, MoonSolid, SunSolid, YoutubeSolid } from "flowbite-svelte-icons";

	import { DISCORD_URL, GITHUB_URL, YOUTUBE_URL } from "$lib/constants";
    import logo from "$lib/images/logo.png";
    import madeByTheCommunity from "$lib/images/mbtc.png"
	import { cookieConsentModal } from "$lib/stores/CookieConsentModalStore";

	import Hr from "./Hr.svelte";
	import ScreenQuery from "./utils/ScreenQuery.svelte";

</script>

<Footer footerType="socialmedia" class="relative flex flex-col items-center bg-gray-200 dark:bg-gray-900 mt-12">
    <div class="absolute -top-[1.9rem] right-0 clip-tl-8 w-[40%] h-8 bg-gray-200 dark:bg-gray-900"></div>
    <div class="w-full max-w-6xl md:flex md:justify-between mt-4 gap-8">
        <div class="flex md:flex-col shrink-0 mb-6 md:mb-0">
            <ScreenQuery size="sm" let:matches>
                <FooterBrand href="/" src={logo} alt="Frontier Consolidated Logo" name={matches ? "Frontier Consolidated" : "FRCN"} classImg="drop-shadow" classSpan="text-gray-700" />
            </ScreenQuery>
            <div class="flex-1 md:flex-none flex justify-end md:justify-center md:mt-4">
                <img src={madeByTheCommunity} alt="Made by the Star Citizen community" class="aspect-square w-16" />
            </div>
        </div>
        <div class="grid min-[380px]:grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
                <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Quick Links</h2>
                <FooterLinkGroup>
                    <FooterLink liClass="mb-4" href="/">Home</FooterLink>
                    <FooterLink liClass="mb-4" href="/about/activities">Activities</FooterLink>
                    <FooterLink liClass="mb-4" href="/about/community">Community</FooterLink>
                    <FooterLink liClass="mb-4" href="/about/org">Organisation</FooterLink>
                    <FooterLink liClass="mb-4" href="/events">Events</FooterLink>
                    <FooterLink liClass="mb-4" href="/knowledge">Guides & Resources</FooterLink>
                </FooterLinkGroup>
            </div>
            <div>
                <h2 class="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">Social</h2>
                <FooterLinkGroup>
                    <FooterLink liClass="mb-4" href={YOUTUBE_URL}>Youtube</FooterLink>
                    <FooterLink liClass="mb-4" href={DISCORD_URL}>Discord</FooterLink>
                    <FooterLink liClass="mb-4" href={GITHUB_URL}>GitHub</FooterLink>
                </FooterLinkGroup>
            </div>
            <div>
                <h2 class="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">Legal</h2>
                <FooterLinkGroup>
                    <FooterLink liClass="mb-4" href="/legal/privacy">Privacy Policy</FooterLink>
                    <li class="mb-4">
                        <button class="hover:underline" on:click={() => {
                            cookieConsentModal.set(true)
                        }}>Cookie Settings</button>
                    </li>
                    <FooterLink liClass="mb-4" href="/legal/cookies">Cookie Policy</FooterLink>
                </FooterLinkGroup>
            </div>
        </div>
    </div>
    <Hr class="w-full my-8 bg-gray-300" />
    <div class="w-full max-w-6xl sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div class="max-w-xl">
            <FooterCopyright href="/" by="Frontier Consolidated" spanClass="block text-sm text-gray-500 dark:text-gray-400" />
            <span class="block text-xs text-gray-500 dark:text-gray-400">This is an unofficial Star Citizen site, not affiliated with the Cloud Imperium group of companies. All content on this site not authored by its host or users are property of their respective owners.</span>
        </div>
        <div class="relative flex mt-4 space-x-6 rtl:space-x-reverse sm:justify-center sm:mt-0 pr-16">
            <FooterIcon href={YOUTUBE_URL}>
                <YoutubeSolid class="w-4 h-4 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white" tabindex="-1" />
            </FooterIcon>
            <FooterIcon href={DISCORD_URL}>
                <DiscordSolid class="w-4 h-4 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white" tabindex="-1" />
            </FooterIcon>
            <FooterIcon href={GITHUB_URL}>
                <GithubSolid class="w-4 h-4 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white" tabindex="-1" />
            </FooterIcon>
            <button class="absolute rounded top-0 bottom-0 right-0 h-[180%] my-auto z-40 p-1 hover:bg-gray-400/30" on:click={() => {
                if (document.documentElement.classList.contains("dark")) {
                    document.documentElement.classList.remove("dark")
                } else {
                    document.documentElement.classList.add("dark")
                }
            }}>
                <SunSolid class="hidden dark:block h-full text-gray-400" tabindex="-1" />
                <MoonSolid class="dark:hidden h-full text-gray-600" tabindex="-1" />
            </button>
        </div>
    </div>
</Footer>