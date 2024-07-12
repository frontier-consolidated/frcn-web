<script lang="ts">
	import { goto, invalidate } from "$app/navigation";
	import { TableBodyCell, TableBodyRow } from "flowbite-svelte";
	import { EditOutline, TrashBinSolid } from "flowbite-svelte-icons";

	import { ConfirmationModal, Tooltip } from "$lib/components";
	import { Mutations, get_apollo } from "$lib/graphql";
	import { push_notification } from "$lib/stores/NotificationStore";

	import type { PageData } from "./$types";

    export let accessKey: PageData["keys"][number];

    let modal_open = false;
</script>

<TableBodyRow data-key-id={accessKey.id} class="group cursor-pointer dark:hover:bg-gray-600" on:click={() => {
    goto(`/admin/general/accesskeys/${accessKey.id}`);
}}>
    <TableBodyCell>
        {accessKey.id}
    </TableBodyCell>
    <TableBodyCell>
        {#if accessKey.description}
            {accessKey.description}
        {:else}
            <span class="text-gray-300 dark:text-gray-600">No description</span>
        {/if}
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
                        ev.stopPropagation();
                        modal_open = true;
                    }}
                />
                Delete
            </Tooltip>
        </div>
    </TableBodyCell>
</TableBodyRow>

<ConfirmationModal title="Delete Access Key - {accessKey.id}" bind:open={modal_open} on:confirm={async () => {
    const { errors } = await get_apollo().mutate({
        mutation: Mutations.DELETE_ACCESS_KEY,
        variables: {
            id: accessKey.id
        },
        errorPolicy: "all",
    });

    if (errors && errors.length > 0) {
        push_notification({
            type: "error",
            message: "Failed to delete access key",
        });
        console.error(errors);
        return;
    }

    await invalidate("app:accesskeys");
    modal_open = false;
}}>
    <span>Are you sure you want to delete the access key? Once deleted it cannot be undone.</span>
</ConfirmationModal>
