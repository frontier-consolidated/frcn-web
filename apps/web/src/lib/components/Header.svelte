<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		MegaMenu,
		Spinner,
	} from "flowbite-svelte";
	import {
		InfoCircleSolid,
		ChevronDownOutline,
		CalendarMonthSolid,
		DiscordSolid,
		BagSolid,
		BuildingSolid,
		UsersSolid,
		BookSolid,
		MapPinAltSolid,
		ArrowUpRightFromSquareOutline
	} from "flowbite-svelte-icons";
	import { twMerge } from "tailwind-merge";

	import { DISCORD_URL, MERCH_URL } from "$lib/constants";
	import logo from "$lib/images/logo.png";
	import { login, logout, user } from "$lib/stores/UserStore";

	import LoginButton from "./LoginButton.svelte";
	import NavUser from "./NavUser.svelte";
	import MediaQuery from "./utils/MediaQuery.svelte"
	import ScreenQuery from "./utils/ScreenQuery.svelte";

	$: activeUrl = $page.url.pathname;

	const aboutItems = [
		{ name: "COMMUNITY", href: "/about/community", description: "Try before you fly", icon: UsersSolid },
		{ name: "ORGANISATION", href: "/about/org", description: "Be part of something great", icon: BuildingSolid },
		{ name: "ACTIVITIES", href: "/about/activities", description: "The joy of multiplayer action", icon: MapPinAltSolid },
		{ name: "MERCH STORE", href: MERCH_URL, target: "_blank", description: "Show your true colours", icon: BagSolid },
	]

	let aboutOpen = false;
	
	const activeClass =
		"clip-br-4 lg:clip-none md:py-2 md:pe-4 md:ps-3 lg:p-0 text-white dark:text-white bg-primary-600 hover:bg-primary-500 dark:hover:bg-primary-700 lg:bg-transparent lg:hover:bg-transparent lg:dark:hover:bg-transparent lg:text-primary-700 lg:dark:text-white dark:bg-primary-600 lg:dark:bg-transparent";
	const nonActiveClass = 'clip-br-4 lg:clip-none md:py-2 md:pe-4 md:ps-3 lg:p-0 text-gray-800 bg-gray-300 hover:bg-gray-200 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 dark:text-gray-400 lg:dark:hover:text-white dark:bg-gray-800 lg:bg-transparent lg:dark:bg-transparent dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent';
</script>

<Navbar fluid let:NavContainer class="text-gray-800 bg-transparent dark:bg-transparent">
	<div class="absolute top-0 left-0 w-full h-full bg-white/50 dark:bg-gray-900/75 backdrop-blur-lg z-0"></div>
	<NavContainer fluid class="sm:max-w-screen-sm md:max-w-4xl lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl z-30">
		<NavBrand href="/" class="ml-2">
			<img src={logo} class="me-3 h-7 sm:h-9 drop-shadow" alt="Frontier Consolidated Logo" />
			<span class="self-center whitespace-nowrap text-lg font-semibold">
				<ScreenQuery size="lg" let:matches>
					{#if !browser || matches}
						Frontier Consolidated
					{:else}
						FRCN
					{/if}
				</ScreenQuery>
			</span>
			<div class="sm:ml-8 sm:mr-4 w-px h-8 lg:bg-gray-700"></div>
		</NavBrand>
		<div class="flex lg:order-2">
			{#if $user.data}
				<NavUser
					on:logout={() => {
						logout().catch(console.error);
					}}
				/>
			{:else}
				<LoginButton spinner class="hidden sm:!block" />
			{/if}
			<a href={DISCORD_URL} class="shrink-0 inline-flex justify-center items-center font-medium ms-5 xl:ms-10 p-0 text-slate-800 dark:text-discord hover:text-discord dark:hover:text-discord-pressed">
				<MediaQuery query="(min-width: 500px)" let:matches>
					{#if matches}
						<DiscordSolid size="lg" class="me-2" tabindex="-1" />Discord
					{:else}
						<DiscordSolid size="lg" tabindex="-1" />
					{/if}
				</MediaQuery>
			</a>
			<NavHamburger class="md:block lg:hidden" />
		</div>
		<NavUl divClass="w-full lg:!block lg:w-auto" class="mr-auto order-1 lg:flex-1 lg:ml-4 lg:mr-4 2xl:ml-8" ulClass="flex flex-col gap-1 lg:py-4 mt-4 lg:!flex-row lg:flex-wrap lg:!gap-x-8 lg:!gap-y-2 rtl:justify-end lg:mt-0 lg:text-sm lg:font-medium border-none bg-transparent dark:bg-transparent" {activeUrl} {activeClass} {nonActiveClass}>
			{#if !$user.data}
				<li class="sm:hidden">
					<button
						class={twMerge("block w-full py-2 pe-4 ps-3 md:p-0 rounded md:border-0", activeClass)}
						on:click={() => {
							if ($user.loading) return;
							login().catch(console.error);
						}}
					>
						{#if $user.loading || !browser}
							<Spinner class="me-2" size="4" color="white" />
						{/if}
						LOGIN
					</button>
				</li>
			{/if}
			<ScreenQuery size="lg" let:matches>
				{#if !browser || matches}
					<NavLi
						class={twMerge("flex gap-2 items-center cursor-pointer", activeUrl.startsWith("/about") ? activeClass : undefined)}
					>
						<InfoCircleSolid size="sm" tabindex="-1" />ABOUT US<ChevronDownOutline class={twMerge("transition-all w-3 h-3", aboutOpen && "rotate-180")} tabindex="-1" />
					</NavLi>
					{#if browser}
						<MegaMenu full offset={26}
							class="bg-gray-100/60 dark:bg-slate-900/80 pb-4 backdrop-blur-xl"
							ulClass="grid grid-flow-row gap-y-4 md:gap-x-8 auto-col-max auto-row-max"
							items={aboutItems}
							bind:open={aboutOpen}
							let:item
						>
							<a href={item.href} target={item.target} class="block transition p-4 border-l border-gray-700 dark:border-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 h-full clip-r-4">
								<div class="flex items-center font-medium text-md text-black dark:text-gray-200">
									<svelte:component this={item.icon} size="sm" class="me-2" tabindex="-1" /> {item.name}
									{#if item.target}
										<ArrowUpRightFromSquareOutline size="xs" class="ms-2" />
									{/if}
								</div>
								<span class="text-gray-700 dark:text-gray-500">{item.description}</span>
							</a>
						</MegaMenu>
					{/if}
				{:else}
					{#each aboutItems as item}
						<NavLi href={item.href} target={item.target} class="flex gap-2 items-center">
							<svelte:component this={item.icon} size="sm" tabindex="-1" />{item.name}
							{#if item.target}
								<ArrowUpRightFromSquareOutline size="sm" class="ml-auto" />
							{/if}
						</NavLi>
					{/each}
				{/if}
			</ScreenQuery>
			{#if !!$user.data}
				<NavLi href="/events" class="flex gap-2 items-center">
					<CalendarMonthSolid size="sm" tabindex="-1" />EVENTS
				</NavLi>
			{/if}
			<NavLi href="/resources" class="flex gap-2 items-center">
				<BookSolid size="sm" tabindex="-1" />RESOURCES
			</NavLi>
		</NavUl>
	</NavContainer>
</Navbar>
