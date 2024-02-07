<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { Permission, hasPermission } from "@frcn/shared";
	import { Button, Heading, Pagination, Search } from "flowbite-svelte";
	import { CirclePlusSolid } from "flowbite-svelte-icons";
	import { queryParam } from "sveltekit-search-params"

	import Hr from "$lib/components/Hr.svelte";
	import type { ResourceFragmentFragment } from "$lib/graphql/__generated__/graphql";
	import { getCurrentPage, getPageUrl, getPages } from "$lib/pageHelpers";
	import { user } from "$lib/stores/UserStore";

	import type { PageData } from "./$types";
	import ResourceCard from "./ResourceCard.svelte";
	import ResourceModal from "./ResourceModal.svelte";

	const search = queryParam("q")

	export let data: PageData;

	let fileModal = { open: false, edit: null } as {
		open: boolean;
		edit: ResourceFragmentFragment | null
	};

	$: currentPage = getCurrentPage($page.url.searchParams);
	$: pages = getPages("/knowledge", $page.url.searchParams, currentPage, data.itemsPerPage, data.total);
</script>

<svelte:head>
	<title>Knowledge</title>
	<meta name="description" content="Frontier Consolidated - Search for Guides & Resources" />
</svelte:head>

<Heading tag="h1" class="font-medium text-4xl">Knowledge</Heading>
<Hr />
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
					<CirclePlusSolid class="me-2" /> Upload Resource
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
			on:previous={() => {if (data.prevPage != null) goto(getPageUrl("/knowledge", $page.url.searchParams, data.prevPage + 1))}}
			on:next={() => {if (data.nextPage != null) goto(getPageUrl("/knowledge", $page.url.searchParams, data.nextPage + 1))}}
		/>
	</div>
</section>
<ResourceModal open={fileModal.open} data={fileModal.edit} />
