<script lang="ts">
	import { goto } from "$app/navigation";
	import { Search, Table, TableHead, TableHeadCell } from "flowbite-svelte";
	import { ArrowLeftSolid } from "flowbite-svelte-icons";
	import { queryParam } from "sveltekit-search-params";

	import Button from "$lib/components/Button.svelte";
	import SectionHeading from "$lib/components/SectionHeading.svelte";
	import { Mutations, getApollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";

	import type { PageData } from "./$types";
	import KeyRow from "./KeyRow.svelte"

	const keySearch = queryParam("q")

	export let data: PageData
</script>

<svelte:head>
	<title>Access Keys - Admin | Frontier Consolidated</title>
</svelte:head>

<a class="flex items-center text-gray-300 mb-2 p-2 cursor-pointer hover:text-gray-400" href="/admin/general">
	<ArrowLeftSolid class="me-2" tabindex="-1" /> Back to General
</a>
<SectionHeading>
    Access Keys
</SectionHeading>
<div class="flex gap-2 px-2 my-4">
    <Search size="md" bind:value={$keySearch} class="rounded" />
    <Button class="shrink-0" on:click={async () => {
		try {
			const { data: createData } = await getApollo().mutate({
				mutation: Mutations.CREATE_ACCESS_KEY,
			});

			if (createData && createData.key) {
				await goto(`/admin/general/accesskeys/${createData.key.id}`, {
					invalidateAll: true,
					state: {
						newAccessKey: createData.key
					}
				});
			}
		} catch (err) {
			pushNotification({
				type: "error",
				message: "Failed to create access key"
			})
			console.error(err)
		}
	}}>
        Create Key
    </Button>
</div>
<div class="flex-1 flex flex-col">
	<Table divClass="relative">
		<TableHead>
			<TableHeadCell>
				Keys - {data.keys.length}
			</TableHeadCell>
			<TableHeadCell>
				Description
			</TableHeadCell>
			<TableHeadCell class="w-32"></TableHeadCell>
		</TableHead>
		<tbody class="divide-y">
			{#each data.keys.filter(k => !$keySearch || k.id.toString() === $keySearch.trim() || k.description.toLowerCase().includes($keySearch.trim().toLowerCase())) as key}
				{#key key.id}
					<KeyRow accessKey={key} />
				{/key}
			{/each}
		</tbody>
	</Table>
</div>