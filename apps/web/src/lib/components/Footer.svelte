<script lang="ts">
	import { Footer, FooterBrand, FooterCopyright, FooterIcon, FooterLink, FooterLinkGroup } from "flowbite-svelte";
	import { DiscordSolid, GithubSolid, YoutubeSolid } from "flowbite-svelte-icons";

	import { DISCORD_URL, GITHUB_URL, YOUTUBE_URL } from "$lib/constants";
    import logo from "$lib/images/logo.png";
	import { cookieConsentModal } from "$lib/stores/CookieConsentModalStore";

	import Hr from "./Hr.svelte";

</script>

<Footer footerType="socialmedia" class="flex flex-col items-center dark:bg-gray-900">
    <div class="w-full max-w-6xl md:flex md:justify-between mt-4 gap-8">
        <div class="shrink-0 mb-6 md:mb-0">
            <FooterBrand href="/" src={logo} alt="Frontier Consolidated Logo" name="Frontier Consolidated" />
        </div>
        <div class="grid min-[380px]:grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
                <h2 class="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">Social</h2>
                <FooterLinkGroup>
                    <FooterLink liClass="mb-4" href={YOUTUBE_URL}>Youtube</FooterLink>
                    <FooterLink liClass="mb-4" href={DISCORD_URL}>Discord</FooterLink>
                    <FooterLink liClass="mb-4" href={GITHUB_URL}>GitHub</FooterLink>
                </FooterLinkGroup>
            </div>
            <div>
                <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
                <FooterLinkGroup>
                    <FooterLink liClass="mb-4" href="/about/activities">Activities</FooterLink>
                    <FooterLink liClass="mb-4" href="/about/community">Community</FooterLink>
                    <FooterLink liClass="mb-4" href="/about/org">Organisation</FooterLink>
                    <FooterLink liClass="mb-4" href="/knowledge">Guides & Resources</FooterLink>
                </FooterLinkGroup>
            </div>
            <div>
                <h2 class="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">Legal</h2>
                <FooterLinkGroup>
                    <FooterLink liClass="mb-4" href="/legal/privacy">Privacy Policy</FooterLink>
                    <FooterLink liClass="mb-4" href="/legal/terms">Terms & Conditions</FooterLink>
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
    <Hr class="w-full my-8" />
    <div class="w-full max-w-6xl sm:flex sm:items-center sm:justify-between">
        <FooterCopyright href="/" by="Frontier Consolidated" />
        <div class="flex mt-4 space-x-6 rtl:space-x-reverse sm:justify-center sm:mt-0">
            <FooterIcon href={YOUTUBE_URL}>
                <YoutubeSolid class="w-4 h-4 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white" tabindex="-1" />
            </FooterIcon>
            <FooterIcon href={DISCORD_URL}>
                <DiscordSolid class="w-4 h-4 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white" tabindex="-1" />
            </FooterIcon>
            <FooterIcon href={GITHUB_URL}>
                <GithubSolid class="w-4 h-4 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white" tabindex="-1" />
            </FooterIcon>
        </div>
    </div>
</Footer>