<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { Helper, Label, Modal, Table, TableHead, TableHeadCell } from "flowbite-svelte";
	import { CloseSolid, EditOutline } from "flowbite-svelte-icons";

	import { Button, Field, FieldValidator, Head, SectionHeading, Select } from "$lib/components";
	import { Mutations, getApollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";

    import type { PageData } from './$types';
	import ChannelRow from "./ChannelRow.svelte";

    export let data: PageData;

    function cloneSettings(data: PageData) {
        return {
            defaultChannel: { ...data.defaultEventChannel },
        }
    }

    const validator = new FieldValidator();
    let editData = cloneSettings(data)

    $: isDirty = data.defaultEventChannel?.id !== editData.defaultChannel.id

    async function save() {
        if (!validator.validate()) return;

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
		}
        editData = cloneSettings(data)
	}

    function createModalData() {
        return {
            channel: null as string | null
        }
    }

    let openModal = false;
    let modalData = createModalData()

    async function createEventChannel() {
        if (!validator.validate()) return;

        const { errors } = await getApollo().mutate({
			mutation: Mutations.CREATE_EVENT_CHANNEL,
			variables: {
				linkTo: modalData.channel!
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
        await invalidate("app:eventchannels")
        openModal = false;
    }
</script>

<Head
	title="Event Channels - Admin"
/>

<SectionHeading>
    Event Channels
</SectionHeading>
<div class="flex-1 flex flex-col justify-between">
    <div class="flex flex-col gap-4 p-4">
        <Field {validator} for="system-channels-guildid" value={"a"} required>
            <Label for="system-channels-default-channel" class="mb-2">Default Event Channel</Label>
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
            <Helper class="mt-1">
                The default channel where events will be posted
            </Helper>
        </Field>
    </div>
    <div class="flex justify-end gap-2 px-2 my-4">
        <Button class="shrink-0" on:click={async () => {
            openModal = true;
        }}>
            Link Channel
        </Button>
    </div>
    <div class="flex-1 flex flex-col overflow-y-auto">
        <Table divClass="relative">
            <TableHead>
                <TableHeadCell>
                    Channels - {data.channels.length}
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
    <div class="flex justify-end items-center gap-2">
        <Button color="alternative" on:click={() => {
            editData = cloneSettings(data)
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
			for="system-channels-channel"
			value={modalData.channel}
			required
		>
			<Label for="system-channels-channel" class="mb-2">Discord Channel</Label>
			<Select
                id="system-channels-channel"
                name="system-channels-channel"
                options={data.options.channels.map((channel) => ({
                    value: channel.id,
                    name: channel.name,
                }))}
                search
                required
                bind:value={modalData.channel}
            />
		</Field>
	</div>
	<svelte:fragment slot="footer">
        <Button on:click={() => {
            createEventChannel().catch(console.error)
        }}>
            Create
        </Button>
        <Button color="alternative" on:click={() => {
            openModal = false;
            modalData = createModalData()
        }}>
            Cancel
        </Button>
  	</svelte:fragment>
</Modal>