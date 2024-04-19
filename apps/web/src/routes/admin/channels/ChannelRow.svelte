<script lang="ts">
	import { goto, invalidate } from "$app/navigation";
	import { Breadcrumb, BreadcrumbItem, Indicator, TableBodyCell, TableBodyRow, Toggle } from "flowbite-svelte";
	import { EditOutline, ExclamationCircleSolid, TrashBinSolid } from "flowbite-svelte-icons";

	import { ConfirmationModal, Tooltip } from "$lib/components";
	import { Mutations, getApollo } from "$lib/graphql";
	import { EventState } from "$lib/graphql/__generated__/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";

	import type { PageData } from "./$types";

    export let channel: PageData["channels"][number];

    let modalOpen = false;
    let deleteRelatedVoiceChannels = false;
</script>

<TableBodyRow data-channel-id={channel.id} class="group cursor-pointer dark:hover:bg-gray-600" on:click={() => {
    goto(`/admin/channels/${channel.id}`);
}}>
    <TableBodyCell>
        <div class="flex items-center">
            {#if !channel.discord.sendMessages}
                <Tooltip>
                    <ExclamationCircleSolid slot="icon" class="me-2 text-orange-500" size="sm" />
                    Missing permissions to post messages in this channel
                </Tooltip>
            {/if}
            <Breadcrumb olClass="inline-flex items-center">
                <BreadcrumbItem spanClass="text-sm font-medium">
                    <div slot="icon"></div>
                    {channel.discordGuild.name}
                </BreadcrumbItem>
                <BreadcrumbItem spanClass="text-sm">
                    {channel.discord.name}
                </BreadcrumbItem>
            </Breadcrumb>
        </div>
    </TableBodyCell>
    <TableBodyCell>
        {#if channel.discordCategory}
            {channel.discordCategory.name}
        {:else}
            <span class="text-red-500">MISSING</span>
        {/if}
    </TableBodyCell>
    <TableBodyCell class="text-center dark:text-gray-400 group-[.dragging]:hidden">
        <div class="flex items-center justify-center gap-2 flex-wrap text-xs">
            <Tooltip>
                <div slot="icon" class="flex items-center">
                    <span>{channel.events.filter(e => e.state === EventState.Started).length}</span>
                    <Indicator color="green" size="xs" class="ms-1 relative">
                        <Indicator color="green" size="xs" class="absolute top-0 left-0 animate-ping" />
                    </Indicator>
                </div>
                Currently running events
            </Tooltip>
            <Tooltip>
                <div slot="icon" class="flex items-center">
                    <span>{channel.events.filter(e => e.state === EventState.Ended).length}</span>
                    <Indicator color="red" size="xs" class="ms-1" />
                </div>
                Ended unarchived events
            </Tooltip>
            <Tooltip>
                <div slot="icon" class="flex items-center">
                    <span>{channel.events.filter(e => e.state === EventState.Archived).length}</span>
                    <Indicator color="dark" size="xs" class="ms-1" />
                </div>
                Archived events
            </Tooltip>
            <Tooltip>
                <div slot="icon" class="flex items-center">
                    <span>{channel.events.filter(e => e.state === EventState.None).length}</span>
                    <Indicator color="yellow" size="xs" class="ms-1" />
                </div>
                Upcoming / draft events
            </Tooltip>
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
                        ev.stopPropagation();
                        modalOpen = true;
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
            id: channel.id,
            deleteVoiceChannels: deleteRelatedVoiceChannels
        },
        errorPolicy: "all",
    });

    if (errors && errors.length > 0) {
        pushNotification({
            type: "error",
            message: "Failed to delete event channel",
        });
        console.error(errors);
        return;
    }

    await invalidate("app:eventchannels");
    modalOpen = false;
}}>
    <p>Are you sure you want to delete the link to the <strong>{channel.discord.name}</strong> event channel? Once deleted it cannot be undone.</p>
    <p>Any scheduled events posted in this channel will have to be reposted in another event channel.</p>
    <Toggle bind:checked={deleteRelatedVoiceChannels}>Delete Voice Channels</Toggle>
</ConfirmationModal>
