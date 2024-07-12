<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { Permission, hasOwnedObjectPermission } from "@frcn/shared";
	import { Dropdown, DropdownItem, Frame, Toolbar, ToolbarButton } from "flowbite-svelte";
	import { DotsVerticalOutline, DownloadSolid, EditOutline, FilePdfSolid, LinkSolid, TrashBinSolid } from "flowbite-svelte-icons";
    import { createEventDispatcher } from "svelte";
	import type { Writable } from "svelte/store";

	import { CreatedByButton, TimeBadge, ConfirmationModal, Button } from "$lib/components";
	import { Mutations, get_apollo } from "$lib/graphql";
	import type { ResourceFragmentFragment } from "$lib/graphql/__generated__/graphql";
	import { push_notification } from "$lib/stores/NotificationStore";
	import { user } from "$lib/stores/UserStore";

    const dispatch = createEventDispatcher();

    export let selected_tags: Writable<string[] | null>;
    export let resource: ResourceFragmentFragment;
    
    let delete_modal_open = false;
</script>

<div class="shadow-md bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded flex flex-col w-full h-full max-w-lg">
    {#if resource.previewUrl}
        <a href={resource.previewUrl} target="_blank">
            <img class="rounded-t aspect-video object-cover hover:brightness-110" src={resource.previewUrl} alt="{resource.name} preview" />
        </a>
    {:else}
        <div class="flex flex-col items-center justify-center rounded-t-lg w-full aspect-video bg-gray-900">
            <FilePdfSolid class="w-24 h-24" />
        </div>
    {/if}
    <div class="flex-1 flex flex-col px-4 py-2">
        <div class="flex flex-wrap gap-1">
            <TimeBadge id="time-{resource.id}" format="datetime" value={resource.updatedAt} class="dark:bg-gray-900" />
            {#each resource.tags as tag}
                <Frame
                    class="border-gray-200 dark:border-gray-700 divide-gray-200 dark:divide-gray-700 font-medium inline-flex items-center justify-center px-2.5 py-0.5 text-xs bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded cursor-pointer"
                    on:click={() => {
                        console.log("click");
                        if ($selected_tags?.includes(tag)) {
                            selected_tags.update(tags => (tags ?? []).filter(t => t !== tag));
                        } else {
                            selected_tags.update(tags => [...(tags ?? []), tag]);
                        }
                    }}
                >
                    {tag}
                </Frame>
            {/each}
        </div>
        <span class="block mt-2 text-xl font-semibold text-gray-800 dark:text-white">
            {resource.name}
        </span>
        <CreatedByButton class="mt-1" user={resource.owner} />
        {#if resource.shortDescription}
            <span class="block text-sm font-semibold dark:text-white mt-3">
                Description
            </span>
            <p class="text-sm dark:text-gray-400">
                {resource.shortDescription}
            </p>
        {/if}
        <div class="flex gap-2 pt-4 mt-auto">
            <Button class="flex-1" on:click={() => {
                if (!resource.downloadUrl) return;
                const link = document.createElement("a");
                link.href = resource.downloadUrl;
                link.click();
                URL.revokeObjectURL(link.href);
            }}>
                <DownloadSolid class="me-2" tabindex="-1" /> Download
            </Button>
            <Toolbar embedded>
                <ToolbarButton name="Options">
                    <DotsVerticalOutline tabindex="-1" />
                </ToolbarButton>
                <Dropdown containerClass="rounded divide-y z-50">
                    <DropdownItem class="flex items-center" on:click={() => {
                        const link = new URL(`/resources?id=${resource.id}`, window.location.origin);
                        navigator.clipboard.writeText(link.href);
                        push_notification({
                            type: "success",
                            message: "Link copied to clipboard!",
                            timeout: 5000
                        });
                    }}>
                        <LinkSolid size="sm" class="me-2" tabindex="-1" /> Share
                    </DropdownItem>
                    {#if hasOwnedObjectPermission({ user: $user.data, owner: resource.owner, required: Permission.CreateResources, override: Permission.ManageResources })}
                        <DropdownItem class="flex items-center" on:click={() => {
                            dispatch("edit", resource);
                        }}>
                            <EditOutline size="sm" class="me-2" tabindex="-1" /> Edit
                        </DropdownItem>
                        <DropdownItem class="flex items-center dark:text-red-500 dark:hover:text-white dark:hover:bg-red-700" on:click={() => (delete_modal_open = true)}>
                            <TrashBinSolid size="sm" class="me-2" tabindex="-1" /> Delete
                        </DropdownItem>
                    {/if}
                </Dropdown>
            </Toolbar>
        </div>
    </div>
</div>

<ConfirmationModal title="Delete resource - {resource.name}" bind:open={delete_modal_open} on:confirm={async () => {
    const { errors } = await get_apollo().mutate({
        mutation: Mutations.DELETE_RESOURCE,
        variables: {
            id: resource.id
        },
        errorPolicy: "all",
    });

    if (errors && errors.length > 0) {
        push_notification({
            type: "error",
            message: "Failed to delete resource",
        });
        console.error(errors);
        return;
    }

    await invalidate("app:resources");
    delete_modal_open = false;
}}>
    <span>Are you sure you want to delete the <strong>{resource.name}</strong> resource? Once deleted it cannot be undone.</span>
</ConfirmationModal>
