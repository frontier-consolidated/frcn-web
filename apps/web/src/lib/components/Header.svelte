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
	} from "flowbite-svelte-icons";
	import { twMerge } from "tailwind-merge";

	import logo from "$lib/images/logo.png";
	import { login, logout, user } from "$lib/stores/UserStore";

	import NavUser from "./NavUser.svelte";
	import ScreenQuery from "./ScreenQuery.svelte";

	$: activeUrl = $page.url.pathname;
	let activeClass =
		"text-white bg-green-700 md:bg-transparent md:text-green-700 md:dark:text-white dark:bg-primary-600 md:dark:bg-transparent";
</script>

<Navbar>
	<NavBrand href="/" class="ml-2">
		<img src={logo} class="me-3 h-7 sm:h-9" alt="Frontier Consolidated Logo" />
		<span class="self-center whitespace-nowrap text-lg font-semibold">
			<ScreenQuery size="sm" let:matches>
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
		<NavHamburger />
	</div>
	<NavUl class="md:ml-4 2xl:ml-8 mr-auto order-1" ulClass="relative flex flex-col p-4 mt-4 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:text-sm md:font-medium" {activeUrl} {activeClass}>
		<NavLi href="/" class="flex gap-2 items-center">
			<HomeSolid size="sm" />Home
		</NavLi>
		<NavLi href="/events" class="flex gap-2 items-center"
			><CalendarMonthSolid size="sm" />Events</NavLi
		>
		<NavLi
			class={twMerge("flex gap-2 items-center cursor-pointer", activeUrl === "/about" ? activeClass : undefined)}
		>
			<InfoCircleSolid size="sm" />About<ChevronDownOutline class="w-3 h-3" />
		</NavLi>
		<Dropdown containerClass="w-full md:w-44 divide-y z-50">
			<DropdownItem href="/about">About Us</DropdownItem>
			<DropdownItem href="https://loudguns.teemill.com/" class="flex items-center"><BagSolid size="sm" class="me-2" /> Merch Store</DropdownItem>
			<DropdownItem href="https://discord.com/invite/frcn" class="flex items-center"><DiscordSolid size="sm" class="me-2" /> Join Our Discord</DropdownItem>
		</Dropdown>
	</NavUl>
</Navbar>