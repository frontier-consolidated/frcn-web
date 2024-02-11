<script lang="ts">
	import { goto, invalidate } from "$app/navigation";
	import { Button, Modal, TableBodyCell, TableBodyRow } from "flowbite-svelte";
	import { DiscordSolid, DotsVerticalOutline, LockSolid, PenSolid, StarSolid, TrashBinSolid, UsersSolid } from "flowbite-svelte-icons";
	import { twMerge } from "tailwind-merge";

	import Tooltip from "$lib/components/Tooltip.svelte";
	import { Mutations, getApollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";

	import type { PageData } from "./$types";

    export let role: PageData["roles"][number]
    export let canMove: boolean = false;
    export let locked: boolean = false;

    $: internalCanMove = canMove && !locked

    let modalOpen = false;
</script>

<TableBodyRow data-role-id={role.id} class={twMerge("group cursor-pointer dark:hover:bg-gray-600", internalCanMove ? undefined : "cannot-reorder")} on:click={() => {
    goto(`/admin/roles/${role.id}`)
}}>
    <TableBodyCell class={twMerge("px-1", internalCanMove ? "move-handle opacity-0 group-hover:opacity-100 cursor-grab" : "opacity-100")}>
        <div class="flex items-center justify-center">
            {#if internalCanMove}
                <DotsVerticalOutline size="sm" class="dark:text-gray-300" />
            {:else if locked}
                <LockSolid size="sm" class="dark:text-gray-300" />
            {/if}
        </div>
    </TableBodyCell>
    <TableBodyCell class="pl-2">
        <div class="flex items-center">
            {#if role.primary}
                <Tooltip>
                    <StarSolid slot="icon" size="xs" class="me-2 text-yellow-300" />
                    Primary role
                </Tooltip>
            {/if}
            {role.name}
            {#if role.discordId}
                <Tooltip>
                    <DiscordSolid slot="icon" size="xs" class="ms-2" />
                    Linked to a discord role
                </Tooltip>
            {/if}
        </div>
    </TableBodyCell>
    <TableBodyCell class="text-center dark:text-gray-400 group-[.dragging]:hidden">
        <div class="flex items-center justify-center dark:hover:text-gray-100">
        <Tooltip placement="left">
                <a slot="icon" class="flex items-center" href="/admin/roles/{role.id}#users" on:click={(ev) => ev.stopPropagation()}>
                    {role.users.length} <UsersSolid class="ms-2" />
                </a>
                View members
            </Tooltip>
        </div>
    </TableBodyCell>
    <TableBodyCell class="group-[.dragging]:hidden">
        <div class="flex items-center justify-end gap-6">
            <Tooltip>
                <PenSolid slot="icon" class="hidden group-hover:inline-block" />
                Edit
            </Tooltip>
            <TrashBinSolid
                aria-disabled={false}
                class={twMerge("dark:text-white dark:hover:text-red-600", locked ? "cursor-not-allowed opacity-50" : "cursor-pointer")}
                on:click={(ev) => {
                    ev.stopPropagation()
                    if (locked) return;
                    modalOpen = true
                }}
            />
        </div>
    </TableBodyCell>
</TableBodyRow>
<Modal title="Delete role - {role.name}" size="xs" bind:open={modalOpen}>
    <span>Are you sure you want to delete the <strong>{role.name}</strong> role? Once deleted it cannot be undone.</span>
    <svelte:fragment slot="footer">
		<Button class="flex-1" on:click={async () => {
			const { errors } = await getApollo().mutate({
                mutation: Mutations.DELETE_ROLE,
                variables: {
                    roleId: role.id
                }
            })

            if (errors && errors.length > 0) {
                pushNotification({
                    type: "error",
                    message: "Failed to delete role",
                });
                console.error(errors);
                return;
            }

            await invalidate("app:allroles")
            modalOpen = false;
		}}>Confirm</Button>
		<Button color="alternative" class="flex-1" on:click={() => modalOpen = false}>Cancel</Button>
  	</svelte:fragment>
</Modal>