<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { Permission, hasPermission } from "@frcn/shared";
	import { Button, Heading, Pagination, Search } from "flowbite-svelte";
	import { CirclePlusSolid } from "flowbite-svelte-icons";
	import { queryParam } from "sveltekit-search-params"

	import Hr from "$lib/components/Hr.svelte";
	import type { ResourceFragmentFragment } from "$lib/graphql/__generated__/graphql";
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
</svelte:head>

<Heading tag="h1" class="font-medium text-4xl">Resources</Heading>
<Hr />
<section class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mt-2 px-4">
	<ToolButton name="SC Trade Tools" img={tradeToolsIcon} href="https://sc-trade.tools/" />
	<ToolButton name="Erkul" img={erkulIcon} href="https://www.erkul.games/" />
	<ToolButton name="Cornerstone" img={cstoneIcon} href="https://finder.cstone.space/" />
	<ToolButton name="CCU Game" img={ccugameIcon} href="https://ccugame.app/your-items/fleet" />
	<ToolButton name="RSI Status" img={rsiIcon} href="https://status.robertsspaceindustries.com/" />
	<ToolButton name="Hangar Link" href="https://hangar.link/">
		<img slot="icon" src={hangarLinkIcon} alt="Hangar Link" class="h-6 object-contain" />
	</ToolButton>
	<ToolButton name="VerseGuide" href="https://verseguide.com/">
		<img slot="icon" src={verseGuideIcon} alt="VerseGuide" class="h-6 object-contain" />
	</ToolButton>
	<ToolButton name="SC Org Tools" img={scorgToolsIcon} href="https://scorg.tools/" />
</section>
<Hr class="mt-4" />
<section class="flex flex-col gap-2 mt-4">
	<div>
		<div class="flex flex-col sm:flex-row gap-2">
			<Search size="md" placeholder="Search by name" class="flex-1 sm:w-96" bind:value={$search} />
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
	<div class="flex flex-col items-center self-start">
		<div class="grid min-[580px]:grid-cols-2 lg:grid-cols-3 gap-2 p-4">
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
<ResourceModal open={fileModal.open} data={fileModal.edit} />
