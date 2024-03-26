<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { Permission, hasPermission } from "@frcn/shared";
	import { Heading, Pagination, Search } from "flowbite-svelte";
	import { CirclePlusSolid } from "flowbite-svelte-icons";
	import { queryParam } from "sveltekit-search-params"

	import { Button, Hr, PageHero } from "$lib/components";
	import type { ResourceFragmentFragment } from "$lib/graphql/__generated__/graphql";
	import heroImageSrcset from "$lib/images/stock/resources-hero.png?w=500;900;1200;1600;2000&format=webp&as=srcset&imagetools"
	import ccugameIcon from "$lib/images/tool-icons/ccugame.png"
	import cstoneIcon from "$lib/images/tool-icons/cornerstone.png"
	import erkulIcon from "$lib/images/tool-icons/erkul.png"
	import hangarLinkIcon from "$lib/images/tool-icons/hangarlink.png"
	import rsiIcon from "$lib/images/tool-icons/rsi.svg"
	import tradeToolsIcon from "$lib/images/tool-icons/sc-trade-tools.webp"
	import scorgToolsIcon from "$lib/images/tool-icons/scorgtools.svg"
	import verseGuideIcon from "$lib/images/tool-icons/verseguide.svg"
	import { getCurrentPage, getPageUrl, getPages } from "$lib/pageHelpers";
	import { user } from "$lib/stores/UserStore";


	import type { PageData } from "./$types";
	import ResourceCard from "./ResourceCard.svelte";
	import ResourceModal from "./ResourceModal.svelte";
	import ToolButton from "./ToolButton.svelte";

	const search = queryParam("q")
	let searchInput = $search;

	const tools = [
		{ name: "SC Trade Tools", icon: tradeToolsIcon, href: "https://sc-trade.tools/" },
		{ name: "Erkul", icon: erkulIcon, href: "https://www.erkul.games/" },
		{ name: "Cornerstone", icon: cstoneIcon, href: "https://finder.cstone.space/" },
		{ name: "CCU Game", icon: ccugameIcon, href: "https://ccugame.app/" },
		{ name: "Server Status", icon: rsiIcon, href: "https://status.robertsspaceindustries.com/" },
		{ name: "Hangar Link", icon: hangarLinkIcon, href: "https://hangar.link/" },
		{ name: "VerseGuide", icon: verseGuideIcon, href: "https://verseguide.com/" },
		{ name: "SC Org Tools", icon: scorgToolsIcon, href: "https://scorg.tools/" },
	]

	export let data: PageData;

	let fileModal = { open: false, edit: null } as {
		open: boolean;
		edit: ResourceFragmentFragment | null
	};

	$: currentPage = getCurrentPage($page.url.searchParams);
	$: pages = getPages($page.url, currentPage, data.itemsPerPage, data.total);
</script>

<svelte:head>
	<title>Resources | Frontier Consolidated</title>
	<meta name="description" content="Frontier Consolidated - Search for Guides & Resources" />
	<link rel="preload" imagesrcset={heroImageSrcset} imagesizes="100vw" as="image" />
</svelte:head>

<PageHero srcset={heroImageSrcset}>
	<Heading tag="h1" class="text-white font-medium text-4xl sm:text-5xl drop-shadow-md">Resources</Heading>
</PageHero>
<div class="flex flex-col mx-auto w-full max-w-6xl p-4">
	<section class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mt-2 px-4">
		{#each tools as tool}
			<ToolButton name={tool.name} img={tool.icon} href={tool.href} />
		{/each}
	</section>
	<Hr class="mt-4" />
	<section class="flex flex-col gap-2 mt-4">
		<div>
			<div class="flex flex-col sm:flex-row gap-2">
				<Search size="md" placeholder="Search by name" class="rounded flex-1 sm:w-96" 
					bind:value={searchInput} 
					on:keydown={(e) => {
						if (e.key === "Enter") search.set(searchInput);
					}} 
					on:blur={() => {
						search.set(searchInput)
					}} 
				/>
				{#if hasPermission($user.data?.permissions ?? 0, Permission.UploadResources)}
					<Button
						class="self-end sm:shrink-0"
						on:click={() => {
							fileModal.edit = null;
							fileModal.open = true;
						}}
					>
						<CirclePlusSolid class="me-2" tabindex="-1" /> Upload Resource
					</Button>
				{/if}
			</div>
		</div>
		<div class="flex flex-col items-center self-start w-full">
			<div class="w-full grid min-[580px]:grid-cols-2 lg:grid-cols-3 gap-2 p-4">
				{#each data.resources as resource}
					<ResourceCard {resource} on:edit={(ev) => {
						fileModal.edit = ev.detail
						fileModal.open = true
					}} />
				{/each}
			</div>
			<Pagination
				{pages}
				on:previous={() => {if (data.prevPage != null) goto(getPageUrl($page.url, data.prevPage + 1))}}
				on:next={() => {if (data.nextPage != null) goto(getPageUrl($page.url, data.nextPage + 1))}}
			/>
		</div>
	</section>
</div>
<ResourceModal open={fileModal.open} data={fileModal.edit} />
