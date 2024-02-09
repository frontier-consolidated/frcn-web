<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Button,
		Dropdown,
		DropdownItem,
		Spinner,
	} from "flowbite-svelte";
	import {
		HomeSolid,
		InfoCircleSolid,
		ChevronDownOutline,
		CalendarMonthSolid,
		DiscordSolid,
		BagSolid,
		BuildingSolid,
		UsersSolid,
		BookSolid,
	} from "flowbite-svelte-icons";
	import { twMerge } from "tailwind-merge";

	import MediaQuery from "$lib/components/MediaQuery.svelte"
	import { DISCORD_URL, MERCH_URL } from "$lib/constants";
	import logo from "$lib/images/logo.png";
	import { login, logout, user } from "$lib/stores/UserStore";

	import NavUser from "./NavUser.svelte";
	import ScreenQuery from "./ScreenQuery.svelte";

	$: activeUrl = $page.url.pathname;
	
	const activeClass =
		"md:py-2 md:pe-4 md:ps-3 lg:p-0 dark:text-white bg-primary-700 dark:hover:bg-primary-700 lg:bg-transparent lg:dark:hover:bg-transparent lg:text-primary-700 lg:dark:text-white dark:bg-primary-600 lg:dark:bg-transparent";
	const nonActiveClass = 'md:py-2 md:pe-4 md:ps-3 lg:p-0 text-gray-700 hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 dark:text-gray-400 lg:dark:hover:text-white dark:bg-gray-800 lg:dark:bg-transparent dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent';
</script>

<Navbar fluid let:NavContainer>
	<NavContainer fluid class="sm:max-w-screen-sm md:max-w-4xl lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
		<NavBrand href="/" class="ml-2">
			<img src={logo} class="me-3 h-7 sm:h-9" alt="Frontier Consolidated Logo" />
			<span class="self-center whitespace-nowrap text-lg font-semibold">
				<ScreenQuery size="lg" let:matches>
					{#if matches}
						Frontier Consolidated
					{:else}
						FRCN
					{/if}
				</ScreenQuery>
			</span>
			<div class="ml-8 mr-4 w-px h-8 lg:bg-gray-700"></div>
		</NavBrand>
		<div class="flex lg:order-2">
			{#if $user.data}
				<NavUser
					on:logout={() => {
						logout().catch(console.error);
					}}
				/>
			{:else if $user.loading || !browser}
				<Button>
					<Spinner class="me-2" size="4" color="white" /> Login
				</Button>
			{:else}
				<Button
					on:click={() => {
						login().catch(console.error);
					}}
				>
					Login
				</Button>
			{/if}
			<Button href={DISCORD_URL} color="none" class="shrink-0 ms-5 xl:ms-10 p-0 text-discord-500 hover:text-discord-200" size="lg">
				<MediaQuery query="(min-width: 410px)" let:matches>
					{#if matches}
						<DiscordSolid size="lg" class="me-2" />Discord
					{:else}
						<DiscordSolid size="lg" />
					{/if}
				</MediaQuery>
			</Button>
			<NavHamburger class="md:block lg:hidden" />
		</div>
		<NavUl divClass="w-full lg:block lg:w-auto" class="lg:flex-1 lg:ml-4 lg:mr-4 2xl:ml-8 mr-auto order-1" ulClass="relative flex flex-col gap-1 lg:py-4 mt-4 lg:flex-row lg:flex-wrap lg:gap-x-8 lg:gap-y-2 rtl:space-x-reverse lg:mt-0 lg:text-sm lg:font-medium border-none dark:bg-transparent" {activeUrl} {activeClass} {nonActiveClass}>
			<NavLi href="/" class="flex gap-2 items-center">
				<HomeSolid size="sm" />Home
			</NavLi>
			<NavLi
				class={twMerge("flex gap-2 items-center cursor-pointer", activeUrl.startsWith("/about") ? activeClass : undefined)}
			>
				<InfoCircleSolid size="sm" />About Us<ChevronDownOutline class="w-3 h-3" />
			</NavLi>
			<Dropdown containerClass="w-full lg:w-44 divide-y z-50">
				<DropdownItem href="/about/activities" class="flex items-center font-normal text-md lg:font-medium lg:text-sm"><CalendarMonthSolid size="sm" class="me-2" /> Activities</DropdownItem>
				<DropdownItem href="/about/community" class="flex items-center font-normal text-md lg:font-medium lg:text-sm"><UsersSolid size="sm" class="me-2" /> Community</DropdownItem>
				<DropdownItem href="/about/org" class="flex items-center font-normal text-md lg:font-medium lg:text-sm"><BuildingSolid size="sm" class="me-2" /> Organisation</DropdownItem>
				<DropdownItem href={MERCH_URL} class="flex items-center font-normal text-md lg:font-medium lg:text-sm"><BagSolid size="sm" class="me-2" /> Merch Store</DropdownItem>
			</Dropdown>
			{#if !!$user.data}
				<NavLi href="/events" class="flex gap-2 items-center">
					<CalendarMonthSolid size="sm" />Events
				</NavLi>
			{/if}
			<NavLi href="/knowledge" class="flex gap-2 items-center">
				<BookSolid size="sm" />Resources
			</NavLi>
		</NavUl>
	</NavContainer>
</Navbar>
