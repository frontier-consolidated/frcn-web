<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { CMSContainerType, type IndexContainer } from "@frcn/cms";
	import { Heading, Input, Label, Modal } from "flowbite-svelte";

	import { transformContainer } from "$lib/cms/transformContainer";
	import { Button, Field, FieldValidator, Head, Hr } from "$lib/components";
	import { Mutations, get_apollo } from "$lib/graphql";
	import { push_notification } from "$lib/stores/NotificationStore";

    import type { PageData } from "./$types";

    const validator = new FieldValidator();
    
    export let data: PageData;
    $: indexes = data.indexes.map(i => transformContainer<IndexContainer>(i));

    function create_modal_data() {
        return {
            identifier: ""
        };
    }

    let modal_open = false;
    let modal_data = create_modal_data();

    async function create_index() {
        if (!validator.validate()) {
			push_notification({
				type: "error",
				message: "Check your inputs",
			});
			return;
		}

        const { errors } = await get_apollo().mutate({
			mutation: Mutations.CREATE_CONTENT_CONTAINER,
			variables: {
				type: CMSContainerType.Index,
				identifier: modal_data.identifier
			},
			errorPolicy: "all",
		});

		if (errors && errors.length > 0) {
			push_notification({
				type: "error",
				message: "Failed to create index",
			});
			console.error(errors);
			return;
		}

		modal_data = create_modal_data();
        await invalidate("cms:indexes");
        modal_open = false;
    }
</script>

<Head
	title="CMS"
/>

<div class="mt-24 flex flex-col p-4 w-full max-w-4xl mx-auto">
    <Heading tag="h1" class="font-medium text-4xl">CMS</Heading>
    <Hr class="mt-8" />
    <div class="flex flex-col items-center gap-2 p-4">
        {#each indexes as index}
        <a href="/cms/{index.id}" class="shadow-md bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 rounded flex flex-col w-full p-4">
            <span class="font-medium">{index.getIdentifier() ?? "???"}</span>
            <span class="text-gray-500 text-xs">{index.id}</span>
        </a>
        {/each}
        <Button class="mt-4" on:click={() => (modal_open = true)}>
            Create Index
        </Button>
    </div>
</div>

<Modal title="Create Index" bind:open={modal_open} dismissable>
	<div class="flex flex-col gap-4 p-4">
		<Field
			{validator}
			for="cms-index-identifier"
			value={modal_data.identifier}
			required
		>
			<Label for="cms-index-identifier" class="mb-2">Identifier</Label>
			<Input
				class="rounded"
				id="cms-index-identifier"
				name="cms-index-identifier"
				type="text"
				placeholder="/"
				required
                maxlength="255"
				bind:value={modal_data.identifier}
			/>
		</Field>

	</div>
	<svelte:fragment slot="footer">
        <Button on:click={() => {
            create_index().catch(console.error);
        }}>
            Create
        </Button>
        <Button color="alternative" on:click={() => {
            modal_open = false;
            modal_data = create_modal_data();
        }}>
            Cancel
        </Button>
  	</svelte:fragment>
</Modal>