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
	import logo from "$lib/images/logo.png";
	import { login, logout, user } from "$lib/stores/UserStore";

	import NavUser from "./NavUser.svelte";
	import ScreenQuery from "./ScreenQuery.svelte";

	$: activeUrl = $page.url.pathname;
	let activeClass =
		"text-white bg-green-700 md:bg-transparent md:text-green-700 md:dark:text-white dark:bg-primary-600 md:dark:bg-transparent";
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
			<div class="ml-8 w-px h-8 md:bg-gray-700"></div>
		</NavBrand>
		<div class="flex md:order-2">
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
			<Button href="https://discord.com/invite/frcn" color="none" class="ms-5 lg:ms-10 p-0 text-discord-500 hover:text-discord-200" size="lg">
				<MediaQuery query="(min-width: 480px)" let:matches>
					{#if matches}
						<DiscordSolid size="lg" class="me-2" />Discord
					{:else}
						<DiscordSolid size="lg" />
					{/if}
				</MediaQuery>
			</Button>
			<NavHamburger />
		</div>
		<NavUl class="md:ml-4 2xl:ml-8 mr-auto order-1" ulClass="relative flex flex-col p-4 mt-4 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:text-sm md:font-medium" {activeUrl} {activeClass}>
			<NavLi href="/" class="flex gap-2 items-center">
				<HomeSolid size="sm" />Home
			</NavLi>
			<NavLi
				class={twMerge("flex gap-2 items-center cursor-pointer", activeUrl.startsWith("/about") ? activeClass : undefined)}
			>
				<InfoCircleSolid size="sm" />About Us<ChevronDownOutline class="w-3 h-3" />
			</NavLi>
			<Dropdown containerClass="w-full md:w-44 divide-y z-50">
				<DropdownItem href="/about/activities" class="flex items-center font-normal text-md md:font-medium md:text-sm"><CalendarMonthSolid size="sm" class="me-2" /> Activities</DropdownItem>
				<DropdownItem href="/about/community" class="flex items-center font-normal text-md md:font-medium md:text-sm"><UsersSolid size="sm" class="me-2" /> Community</DropdownItem>
				<DropdownItem href="/about/org" class="flex items-center font-normal text-md md:font-medium md:text-sm"><BuildingSolid size="sm" class="me-2" /> Organisation</DropdownItem>
				<DropdownItem href="https://loudguns.teemill.com/" class="flex items-center font-normal text-md md:font-medium md:text-sm"><BagSolid size="sm" class="me-2" /> Merch Store</DropdownItem>
			</Dropdown>
			<NavLi href="/events" class="flex gap-2 items-center"
				><CalendarMonthSolid size="sm" />Events</NavLi
			>
			<NavLi href="/knowledge" class="flex gap-2 items-center">
				<BookSolid size="sm" />Knowledge
			</NavLi>
		</NavUl>
	</NavContainer>
</Navbar>
