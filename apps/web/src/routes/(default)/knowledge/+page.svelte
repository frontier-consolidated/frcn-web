<script lang="ts">
	import { Permission, hasPermission } from "@frcn/shared";
	import { Avatar, Badge, Button, Card, Heading, Search } from "flowbite-svelte";
	import { CirclePlusSolid, DownloadSolid, FileSolid } from "flowbite-svelte-icons";
	import { queryParam } from "sveltekit-search-params"

	import TimeBadge from "$lib/components/datetime/TimeBadge.svelte";
	import Hr from "$lib/components/Hr.svelte";
	import { user } from "$lib/stores/UserStore";

	import type { PageData } from "./$types";
	import ResourceModal from "./ResourceModal.svelte";

	const search = queryParam("q")

	export let data: PageData;

	let fileModal = { open: false, edit: null };
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
					<CirclePlusSolid class="me-2" /> Upload File
				</Button>
			{/if}
		</div>
	</div>
	<div class="grid min-[480px]:grid-cols-2 md:grid-cols-3 gap-2">
		{#each data.resources as resource}
			<Card padding="none" size="md">
				{#if resource.previewUrl}
					<a href={resource.previewUrl} target="_blank">
						<img class="rounded-t-lg hover:brightness-110" src={resource.previewUrl} alt="{resource.name} preview" />
					</a>
				{:else}
					<div class="flex flex-col items-center justify-center rounded-t-lg w-full aspect-video bg-gray-900">
						<FileSolid class="w-16 h-16" />
					</div>
				{/if}
				<div class="px-4 py-2">
					<div class="flex flex-wrap gap-1">
						<TimeBadge id="time-{resource.id}" format="datetime" value={resource.createdAt} class="dark:bg-gray-900" />
						{#each resource.tags as tag}
						<Badge>
							{tag}
						</Badge>
						{/each}
					</div>
					<span class="block mt-2 text-xl font-semibold dark:text-white">
						{resource.name}
					</span>
					<div class="flex items-center gap-2 mt-1">
						<span class="text-sm">By</span>
						<Avatar rounded size="xs" src={resource.owner.avatarUrl} />
						<span class="text-sm font-semibold text-gray-200">{resource.owner.name}</span>
					</div>
					<span class="block text-sm font-semibold dark:text-white mt-3">
						Description
					</span>
					<p class="text-sm dark:text-gray-400">
						{resource.shortDescription}
					</p>
					<div class="flex mt-4">
						<Button class="flex-1" on:click={() => {
							if (!resource.downloadUrl) return;
							const link = document.createElement("a")
							link.href = resource.downloadUrl
							link.click()
							URL.revokeObjectURL(link.href)
						}}>
							<DownloadSolid class="me-2" /> Download
						</Button>
					</div>
				</div>
			</Card>
		{/each}
	</div>
</section>
<ResourceModal open={fileModal.open} />