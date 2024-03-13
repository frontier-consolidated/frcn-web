<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { Permission, hasPermission } from "@frcn/shared";
	import { Badge, Button, Dropdown, DropdownItem, Toolbar, ToolbarButton } from "flowbite-svelte";
	import { DotsVerticalOutline, DownloadSolid, EditOutline, FileSolid, TrashBinSolid } from "flowbite-svelte-icons";
    import { createEventDispatcher } from "svelte";

	import { CreatedByButton, TimeBadge, ConfirmationModal } from "$lib/components";
	import { Mutations, getApollo } from "$lib/graphql";
	import type { ResourceFragmentFragment } from "$lib/graphql/__generated__/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";
	import { user } from "$lib/stores/UserStore";

    const dispatch = createEventDispatcher()

    export let resource: ResourceFragmentFragment;
    
    let deleteModalOpen = false;
</script>

<div class="bg-gray-200 dark:bg-gray-700 shadow-md p-px rounded max-w-lg">
    <div class="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded flex flex-col w-full h-full">
        {#if resource.previewUrl}
            <a href={resource.previewUrl} target="_blank">
                <img class="rounded-t aspect-video object-cover hover:brightness-110" src={resource.previewUrl} alt="{resource.name} preview" />
            </a>
        {:else}
            <div class="flex flex-col items-center justify-center rounded-t-lg w-full aspect-video bg-gray-900">
                <FileSolid class="w-16 h-16" />
            </div>
        {/if}
        <div class="flex-1 flex flex-col px-4 py-2">
            <div class="flex flex-wrap gap-1">
                <TimeBadge id="time-{resource.id}" format="datetime" value={resource.updatedAt} class="dark:bg-gray-900" />
                {#each resource.tags as tag}
                <Badge>
                    {tag}
                </Badge>
                {/each}
            </div>
            <span class="block mt-2 text-xl font-semibold text-gray-800 dark:text-white">
                {resource.name}
            </span>
            <CreatedByButton class="mt-1" user={resource.owner} />
            <span class="block text-sm font-semibold dark:text-white mt-3">
                Description
            </span>
            <p class="text-sm dark:text-gray-400">
                {resource.shortDescription}
            </p>
            <div class="flex gap-2 pt-4 mt-auto">
                <Button class="flex-1 rounded-none clip-opposite-4" on:click={() => {
                    if (!resource.downloadUrl) return;
                    const link = document.createElement("a")
                    link.href = resource.downloadUrl
                    link.click()
                    URL.revokeObjectURL(link.href)
                }}>
                    <DownloadSolid class="me-2" tabindex="-1" /> Download
                </Button>
                {#if hasPermission($user.data?.permissions ?? 0, Permission.UploadResources)}
                    <Toolbar embedded>
                        <ToolbarButton name="Options">
                            <DotsVerticalOutline tabindex="-1" />
                        </ToolbarButton>
                        <Dropdown containerClass="rounded divide-y z-50">
                            <DropdownItem class="flex items-center" on:click={() => {
                                dispatch("edit", resource)
                            }}>
                                <EditOutline size="sm" class="me-2" tabindex="-1" /> Edit
                            </DropdownItem>
                            <DropdownItem class="flex items-center dark:text-red-500 dark:hover:text-white dark:hover:bg-red-700" on:click={() => (deleteModalOpen = true)}>
                                <TrashBinSolid size="sm" class="me-2" tabindex="-1" /> Delete
                            </DropdownItem>
                        </Dropdown>
                    </Toolbar>
                {/if}
            </div>
        </div>
    </div>
</div>

<ConfirmationModal title="Delete resource - {resource.name}" bind:open={deleteModalOpen} on:confirm={async () => {
    const { errors } = await getApollo().mutate({
        mutation: Mutations.DELETE_RESOURCE,
        variables: {
            id: resource.id
        },
        errorPolicy: "all",
    })

    if (errors && errors.length > 0) {
        pushNotification({
            type: "error",
            message: "Failed to delete resource",
        });
        console.error(errors);
        return;
    }

    await invalidate("app:resources")
    deleteModalOpen = false;
}}>
    <span>Are you sure you want to delete the <strong>{resource.name}</strong> resource? Once deleted it cannot be undone.</span>
</ConfirmationModal>
