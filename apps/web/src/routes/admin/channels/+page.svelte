<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { Helper, Label, Modal, Table, TableHead, TableHeadCell, Toggle } from "flowbite-svelte";
	import { CloseSolid, EditOutline, ExclamationCircleSolid } from "flowbite-svelte-icons";

	import { Button, Field, FieldValidator, Head, SectionHeading, Select } from "$lib/components";
	import Tooltip from "$lib/components/Tooltip.svelte";
	import { Mutations, getApollo } from "$lib/graphql";
	import preventNavigation from "$lib/preventNavigation";
	import { pushNotification } from "$lib/stores/NotificationStore";

    import type { PageData } from "./$types";
	import ChannelRow from "./ChannelRow.svelte";

    export let data: PageData;

    function cloneSettings(data: PageData) {
        return {
            defaultChannel: { ...data.defaultEventChannel },
        };
    }

    const validator = new FieldValidator();
    let editData = cloneSettings(data);

    const { canNavigate, initNavigation } = preventNavigation();

	let isDirty = false;
	$: {
		isDirty = data.defaultEventChannel?.id !== editData.defaultChannel.id;
		canNavigate.set(!isDirty);
	}

    async function save() {
        if (!validator.validate()) {
			pushNotification({
				type: "error",
				message: "Check your inputs",
			});
			return;
		}

		const { data: updatedData, errors } = await getApollo().mutate({
			mutation: Mutations.EDIT_SYSTEM_SETTINGS,
			variables: {
				data: {
                    defaultEventChannelId: editData.defaultChannel.id
                }
			},
			errorPolicy: "all",
		});

		if (errors && errors.length > 0) {
			pushNotification({
				type: "error",
				message: "Failed to save",
			});
			console.error(errors);
			return;
		}

		data = {
			...data, 
			...updatedData?.settings
		};
        editData = cloneSettings(data);
	}

    function createModalData() {
        return {
            channel: null as string | null,
            category: null as string | null,
            existingReadyRoom: null as string | null,
            showExistingReadyRoom: false
        };
    }

    let openModal = false;
    let modalData = createModalData();

    async function createEventChannel() {
        if (!validator.validate()) {
			pushNotification({
				type: "error",
				message: "Check your inputs",
			});
			return;
		}

        const { errors } = await getApollo().mutate({
			mutation: Mutations.CREATE_EVENT_CHANNEL,
			variables: {
				linkTo: modalData.channel!,
                categoryId: modalData.category!,
                existingReadyRoomId: modalData.showExistingReadyRoom ? modalData.existingReadyRoom : undefined
			},
			errorPolicy: "all",
		});

		if (errors && errors.length > 0) {
			pushNotification({
				type: "error",
				message: "Failed to create event channel",
			});
			console.error(errors);
			return;
		}

		modalData = createModalData();
        await invalidate("app:eventchannels");
        openModal = false;
    }
</script>

<Head
	title="Event Channels - Admin"
/>

<SectionHeading>
    Event Channels
</SectionHeading>
<div class="flex-1 flex flex-col justify-between" use:initNavigation>
    <div class="flex flex-col gap-4 p-4">
        <Field {validator} for="system-channels-guildid" value={"a"} required>
            <Label for="system-channels-default-channel" class="mb-2">Default Event Channel</Label>
            <div class="flex items-center gap-2">
                <Select
                    id="system-channels-default-channel"
                    name="system-channels-default-channel"
                    options={data.channels.map((channel) => ({
                        value: channel.id,
                        name: channel.discord.name,
                    })) ?? [{ value: editData.defaultChannel.id, name: editData.defaultChannel.discord?.name }]}
                    required
                    bind:value={editData.defaultChannel.id}
                />
                {#if !data.defaultEventChannel}
                    <Tooltip>
                        <ExclamationCircleSolid slot="icon" class="ms-2 text-orange-500" size="lg" />
                        A default channel must be set to create events
                    </Tooltip>
                {:else if !data.defaultEventChannel.discord.sendMessages}
                    <Tooltip>
                        <ExclamationCircleSolid slot="icon" class="ms-2 text-orange-500" size="lg" />
                        Missing permissions to post messages in this channel
                    </Tooltip>
                {/if}
            </div>
            <Helper class="mt-1">
                The default channel where events will be posted
            </Helper>
        </Field>
    </div>
    <div class="flex justify-end gap-2 px-2 my-4">
        <Button class="shrink-0" on:click={async () => {
            openModal = true;
        }}>
            Link New Channel
        </Button>
    </div>
    <div class="flex-1 flex flex-col">
        <Table divClass="relative">
            <TableHead>
                <TableHeadCell>
                    Channels - {data.channels.length}
                </TableHeadCell>
                <TableHeadCell>
                    Voice Category
                </TableHeadCell>
                <TableHeadCell class="w-40">
                    Events
                </TableHeadCell>
                <TableHeadCell class="w-32"></TableHeadCell>
            </TableHead>
            <tbody class="divide-y">
                {#each data.channels as channel}
                    {#key channel.id}
                        <ChannelRow {channel} />
                    {/key}
                {/each}
            </tbody>
        </Table>
    </div>
    <div class="flex justify-end items-center gap-2 pt-2">
        <Button color="alternative" on:click={() => {
            editData = cloneSettings(data);
        }}>
            <CloseSolid class="me-2" tabindex="-1" /> Cancel
        </Button>
        <Button
            disabled={!isDirty}
            on:click={() => {
                if (!isDirty) return;
                save();
            }}
        >
            <EditOutline class="me-2" tabindex="-1" /> Save
        </Button>
    </div>
</div>

<Modal title="Create Event Channel" bind:open={openModal} dismissable bodyClass="overflow-y-visible">
	<div class="flex flex-col gap-4 p-4">
		<Field
			{validator}
			for="system-channels-new-link-channel"
			value={modalData.channel}
			required
		>
			<Label for="system-channels-new-link-channel" class="mb-2">Discord Channel</Label>
			<Select
                id="system-channels-new-link-channel"
                name="system-channels-new-link-channel"
                options={data.options.channels.filter(channel => channel.sendMessages).map((channel) => ({
                    value: channel.id,
                    name: channel.name,
                }))}
                search
                required
                bind:value={modalData.channel}
            />
            <Helper class="mt-1">
                Only channels the bot can send messages in will appear in this list, if a channel is not appearing the bot is probably missing permissions
            </Helper>
		</Field>
        <Field
			{validator}
			for="system-channels-new-link-category"
			value={modalData.category}
			required
		>
			<Label for="system-channels-new-link-category" class="mb-2">Discord Category</Label>
			<Select
                id="system-channels-new-link-category"
                name="system-channels-new-link-category"
                options={data.options.categories.map((category) => ({
                    value: category.id,
                    name: category.name,
                }))}
                search
                required
                bind:value={modalData.category}
            />
            <Helper class="mt-1">
                The category that event voice channels will be created under
            </Helper>
		</Field>
        <div class="flex flex-col gap-2">
            <Toggle bind:checked={modalData.showExistingReadyRoom} on:change={() => {
                if (!modalData.showExistingReadyRoom) modalData.existingReadyRoom = null;
            }}>
                Use existing ready room
            </Toggle>
            {#if modalData.showExistingReadyRoom}
                <Field
                    {validator}
                    for="system-channels-new-link-ready-room"
                    value={modalData.existingReadyRoom}
                    required
                >
                    <Label for="system-channels-new-link-ready-room" class="mb-2">Ready Room Channel</Label>
                    <Select
                        id="system-channels-new-link-ready-room"
                        name="system-channels-new-link-ready-room"
                        options={data.options.voiceChannels.filter(vc => vc.parentId === modalData.category).map((vc) => ({
                            value: vc.id,
                            name: vc.name,
                        }))}
                        search
                        required
                        bind:value={modalData.existingReadyRoom}
                    />
                </Field>
            {/if}
        </div>
	</div>
	<svelte:fragment slot="footer">
        <Button on:click={() => {
            createEventChannel().catch(console.error);
        }}>
            Create
        </Button>
        <Button color="alternative" on:click={() => {
            openModal = false;
            modalData = createModalData();
        }}>
            Cancel
        </Button>
  	</svelte:fragment>
</Modal>