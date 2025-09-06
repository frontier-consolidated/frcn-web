<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { CMSContainerType, type IndexContainer } from "@frcn/cms";
	import { Heading, Input, Label, Modal } from "flowbite-svelte";

	import { transformContainer } from "$lib/cms/transformContainer";
	import { Button, Field, FieldValidator, Head, Hr } from "$lib/components";
	import { Mutations, getApollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";

	import type { PageData } from "./$types";

	const validator = new FieldValidator();

	export let data: PageData;
	$: indexes = data.indexes.map((i) => transformContainer<IndexContainer>(i));

	function createModalData() {
		return {
			identifier: ""
		};
	}

	let openModal = false;
	let modalData = createModalData();

	async function createIndex() {
		if (!validator.validate()) {
			pushNotification({
				type: "error",
				message: "Check your inputs"
			});
			return;
		}

		const { errors } = await getApollo().mutate({
			mutation: Mutations.CREATE_CONTENT_CONTAINER,
			variables: {
				type: CMSContainerType.Index,
				identifier: modalData.identifier
			},
			errorPolicy: "all"
		});

		if (errors && errors.length > 0) {
			pushNotification({
				type: "error",
				message: "Failed to create index"
			});
			console.error(errors);
			return;
		}

		modalData = createModalData();
		await invalidate("cms:indexes");
		openModal = false;
	}
</script>

<Head title="CMS" />

<div class="mx-auto mt-24 flex w-full max-w-4xl flex-col p-4">
	<Heading tag="h1" class="text-4xl font-medium">CMS</Heading>
	<Hr class="mt-8" />
	<div class="flex flex-col items-center gap-2 p-4">
		{#each indexes as index}
			<a
				href="/cms/{index.id}"
				class="flex w-full flex-col rounded bg-white p-4 text-gray-500 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-900"
			>
				<span class="font-medium">{index.getIdentifier() ?? "???"}</span>
				<span class="text-xs text-gray-500">{index.id}</span>
			</a>
		{/each}
		<Button class="mt-4" on:click={() => (openModal = true)}>Create Index</Button>
	</div>
</div>

<Modal title="Create Index" bind:open={openModal} dismissable>
	<div class="flex flex-col gap-4 p-4">
		<Field {validator} for="cms-index-identifier" value={modalData.identifier} required>
			<Label for="cms-index-identifier" class="mb-2">Identifier</Label>
			<Input
				class="rounded"
				id="cms-index-identifier"
				name="cms-index-identifier"
				type="text"
				placeholder="/"
				required
				maxlength="255"
				bind:value={modalData.identifier}
			/>
		</Field>
	</div>
	<svelte:fragment slot="footer">
		<Button
			on:click={() => {
				createIndex().catch(console.error);
			}}
		>
			Create
		</Button>
		<Button
			color="alternative"
			on:click={() => {
				openModal = false;
				modalData = createModalData();
			}}
		>
			Cancel
		</Button>
	</svelte:fragment>
</Modal>
