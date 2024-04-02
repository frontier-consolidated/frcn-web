<script lang="ts">
	import { goto, invalidate } from "$app/navigation";
	import { TableBodyCell, TableBodyRow } from "flowbite-svelte";
	import { EditOutline, TrashBinSolid } from "flowbite-svelte-icons";

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
        {channel.discord.name}
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
    // const { errors } = await getApollo().mutate({
    //     mutation: Mutations.DELETE_ACCESS_KEY,
    //     variables: {
    //         id: accessKey.id
    //     },
    //     errorPolicy: "all",
    // })

    // if (errors && errors.length > 0) {
    //     pushNotification({
    //         type: "error",
    //         message: "Failed to delete access key",
    //     });
    //     console.error(errors);
    //     return;
    // }

    // await invalidate("app:accesskeys")
    // modalOpen = false;
}}>
    <span>Are you sure you want to delete the link to the <strong>{channel.discord.name}</strong> event channel? Once deleted it cannot be undone.</span>
    <span>Any scheduled events posted in this channel will have to be reposted in another event channel.</span>
</ConfirmationModal>
