<script lang="ts">
	import { goto } from '$app/navigation';
	import { CMSContainerType } from '@frcn/cms';
    import { strings } from "@frcn/shared"
    import { ArrowLeftSolid, CloseSolid, EditOutline } from "flowbite-svelte-icons"

	import { transformContainer } from '$lib/cms/transformContainer';
	import { Button, ConfirmationModal, SectionHeading } from '$lib/components';
	import { Mutations, getApollo } from '$lib/graphql';
	import { pushNotification } from '$lib/stores/NotificationStore';

    import type { PageData } from './$types';
	import ContainerConfigRenderer from './ContainerConfigRenderer.svelte';

    export let data: PageData;
    $: console.log("Container Data:", data.container)
    $: container = transformContainer(data.container)

    $: isDirty = false;

    let deleteModalOpen = false;
</script>

<svelte:head>
	<title>Edit Container - CMS | Frontier Consolidated</title>
</svelte:head>

<div class="mt-24 flex flex-col min-h-[80vh] py-4 px-3 w-full max-w-4xl mx-auto bg-gray-50 rounded dark:bg-gray-900">
    {#if data.container.parent?.id}
        <a class="flex items-center text-gray-300 mb-2 p-2 cursor-pointer hover:text-gray-400" href="/cms/{data.container.parent.id}">
            <ArrowLeftSolid class="me-2" tabindex="-1" /> Back to Parent Container
        </a>
    {:else if container.type === CMSContainerType.Index}
        <a class="flex items-center text-gray-300 mb-2 p-2 cursor-pointer hover:text-gray-400" href="/cms">
            <ArrowLeftSolid class="me-2" tabindex="-1" /> Back to Indexes
        </a>
    {/if}
    <SectionHeading>
        Edit Container - {strings.toTitleCase(container.type)}
    </SectionHeading>
    <div class="flex-1 flex flex-col justify-between">
        <div class="flex flex-col gap-4 p-4">
            <ContainerConfigRenderer {container} isChild={!!data.container.parent} />
        </div>
        <div class="flex justify-end items-center gap-2">
            <Button color="red" class="mr-auto" on:click={() => {
                deleteModalOpen = true;
            }}>
                <CloseSolid class="me-2" tabindex="-1" /> Delete
            </Button>
            <Button color="alternative" on:click={() => {
                container = transformContainer(data.container)
            }}>
                <CloseSolid class="me-2" tabindex="-1" /> Cancel
            </Button>
            <Button
                disabled={!isDirty}
                on:click={() => {
                    if (!isDirty) return;
                    // save().catch(console.error);
                }}
            >
                <EditOutline class="me-2" tabindex="-1" /> Save
            </Button>
        </div>
    </div>
</div>

<ConfirmationModal title="Delete container" bind:open={deleteModalOpen} on:confirm={async () => {
    const { errors } = await getApollo().mutate({
        mutation: Mutations.DELETE_CONTENT_CONTAINER,
        variables: {
            id: container.id
        },
		errorPolicy: "all",
    })

    if (errors && errors.length > 0) {
        pushNotification({
            type: "error",
            message: "Failed to delete container",
        });
        console.error(errors);
        return;
    }

    deleteModalOpen = false;
	goto("/cms")
}}>
    <span>Are you sure you want to delete this container? Once deleted it cannot be undone.</span>
</ConfirmationModal>