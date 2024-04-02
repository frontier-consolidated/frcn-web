<script lang="ts">
	import { goto, invalidate } from "$app/navigation";
	import { TableBodyCell, TableBodyRow } from "flowbite-svelte";
	import { EditOutline, ExclamationCircleSolid, TrashBinSolid } from "flowbite-svelte-icons";

	import { ConfirmationModal, Tooltip } from "$lib/components";
	import { Mutations, getApollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";

	import type { PageData } from "./$types";

    export let channel: PageData["channels"][number]

    let modalOpen = false;
</script>

<TableBodyRow data-channel-id={channel.id} class="group cursor-pointer dark:hover:bg-gray-600" on:click={() => {
    goto(`/admin/channels/${channel.id}`)
}}>
    <TableBodyCell>
        <div class="flex items-center">
            {#if !channel.discord.sendMessages}
                <Tooltip>
                    <ExclamationCircleSolid slot="icon" class="me-2 text-orange-500" size="sm" />
                    Missing permissions to post messages in this channel
                </Tooltip>
            {/if}
            {channel.discord.name}
        </div>
    </TableBodyCell>
    <TableBodyCell>
        <div class="flex items-center justify-end gap-6">
            <Tooltip>
                <EditOutline slot="icon" class="hidden group-hover:inline-block" />
                Edit
            </Tooltip>
            <Tooltip>
                <TrashBinSolid
                    slot="icon"
                    aria-disabled={false}
                    class="dark:text-white dark:hover:text-red-600 cursor-pointer"
                    on:click={(ev) => {
                        ev.stopPropagation()
                        modalOpen = true
                    }}
                />
                Delete
            </Tooltip>
        </div>
    </TableBodyCell>
</TableBodyRow>

<ConfirmationModal title="Delete Channel Link - {channel.discord.name}" bind:open={modalOpen} on:confirm={async () => {
    const { errors } = await getApollo().mutate({
        mutation: Mutations.DELETE_EVENT_CHANNEL,
        variables: {
            id: channel.id
        },
        errorPolicy: "all",
    })

    if (errors && errors.length > 0) {
        pushNotification({
            type: "error",
            message: "Failed to delete event channel",
        });
        console.error(errors);
        return;
    }

    await invalidate("app:eventchannels")
    modalOpen = false;
}}>
    <p>Are you sure you want to delete the link to the <strong>{channel.discord.name}</strong> event channel? Once deleted it cannot be undone.</p>
    <p>Any scheduled events posted in this channel will have to be reposted in another event channel.</p>
</ConfirmationModal>
