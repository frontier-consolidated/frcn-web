<script lang="ts">
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Button,
		Dropdown,
		DropdownItem,
	} from "flowbite-svelte";
	import {
		HomeSolid,
		InfoCircleSolid,
		ChevronDownOutline,
		CalendarMonthSolid,
	} from "flowbite-svelte-icons";
	import { page } from "$app/stores";
	import logo from "$lib/images/logo.png";
	import ScreenQuery from "./ScreenQuery.svelte";
	import NavUser from "./NavUser.svelte";
	import { login, logout, user } from "$lib/stores/UserStore";

	$: activeUrl = $page.url.pathname;
	let activeClass =
		"text-white bg-green-700 md:bg-transparent md:text-green-700 md:dark:text-white dark:bg-green-600 md:dark:bg-transparent";
</script>

<Navbar class="pl-4">
	<NavBrand href="/">
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
	<div class="ml-4 flex md:order-2">
		{#if $user.data}
			<NavUser
				on:logout={() => {
					logout().catch(console.error);
				}}
			/>
		{:else}
			<Button
				on:click={() => {
					login().catch(console.error);
				}}>Login</Button
			>
		{/if}
		<NavHamburger />
	</div>
	<NavUl class="relative ml-4 2xl:ml-8 mr-auto order-1" {activeUrl} {activeClass}>
		<NavLi href="/" class="flex gap-2 items-center">
			<HomeSolid size="sm" />Home
		</NavLi>
		<NavLi href="/events" class="flex gap-2 items-center"
			><CalendarMonthSolid size="sm" />Events</NavLi
		>
		<NavLi
			class="flex gap-2 items-center cursor-pointer {activeUrl == '/about'
				? activeClass
				: ''}"
		>
			<InfoCircleSolid size="sm" />About<ChevronDownOutline class="w-3 h-3" />
		</NavLi>
		<Dropdown class="w-full lg:w-44 z-20">
			<DropdownItem href="/about">About Us</DropdownItem>
			<DropdownItem href="https://discord.com/invite/frcn">Join Our Discord</DropdownItem>
		</Dropdown>
	</NavUl>
</Navbar>
