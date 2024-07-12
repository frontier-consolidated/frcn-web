<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { Helper, Label, Modal, Spinner, Table, TableHead, TableHeadCell, Toggle } from "flowbite-svelte";
	import { CloseSolid, EditOutline, ExclamationCircleSolid } from "flowbite-svelte-icons";

	import { Button, Field, FieldValidator, Head, SectionHeading, Select } from "$lib/components";
	import Tooltip from "$lib/components/Tooltip.svelte";
	import { Mutations, Queries, get_apollo } from "$lib/graphql";
	import prevent_navigation from "$lib/preventNavigation";
	import { push_notification } from "$lib/stores/NotificationStore";

    import type { PageData } from "./$types";
	import ChannelRow from "./ChannelRow.svelte";

    export let data: PageData;

    function clone_settings(data: PageData) {
        return {
            defaultChannel: { ...data.defaultEventChannel },
        };
    }

    const validator = new FieldValidator();
    let edit_data = clone_settings(data);

    const { can_navigate, init_navigation } = prevent_navigation();

	let is_dirty = false;
	$: {
		is_dirty = data.defaultEventChannel?.id !== edit_data.defaultChannel.id;
		can_navigate.set(!is_dirty);
	}

    async function save() {
        if (!validator.validate()) {
			push_notification({
				type: "error",
				message: "Check your inputs",
			});
			return;
		}

		const { data: updated_data, errors } = await get_apollo().mutate({
			mutation: Mutations.EDIT_SYSTEM_SETTINGS,
			variables: {
				data: {
                    defaultEventChannelId: edit_data.defaultChannel.id
                }
			},
			errorPolicy: "all",
		});

		if (errors && errors.length > 0) {
			push_notification({
				type: "error",
				message: "Failed to save",
			});
			console.error(errors);
			return;
		}

		data = {
			...data, 
			...updated_data?.settings
		};
        edit_data = clone_settings(data);
	}

    function create_modal_data() {
        return {
            guild: data.defaultGuild.id,
            channel: null as string | null,
            category: null as string | null,
            existingReadyRoom: null as string | null,
            showExistingReadyRoom: false
        };
    }

    let modal_open = false;
    let modal_data = create_modal_data();

    async function create_event_channel() {
        if (!validator.validate()) {
			push_notification({
				type: "error",
				message: "Check your inputs",
			});
			return;
		}

        const { errors } = await get_apollo().mutate({
			mutation: Mutations.CREATE_EVENT_CHANNEL,
			variables: {
                guildId: modal_data.guild!,
				channelId: modal_data.channel!,
                categoryId: modal_data.category!,
                existingReadyRoomId: modal_data.showExistingReadyRoom ? modal_data.existingReadyRoom : undefined
			},
			errorPolicy: "all",
		});

		if (errors && errors.length > 0) {
			push_notification({
				type: "error",
				message: "Failed to create event channel",
			});
			console.error(errors);
			return;
		}

		modal_data = create_modal_data();
        await invalidate("app:eventchannels");
        modal_open = false;
    }

    let modal_options = data.options;

    let fetching_guild_data = false;
    let previous_guild_id = modal_data.guild;
    $: {
        if (modal_data.guild !== previous_guild_id) {
            previous_guild_id = modal_data.guild;
            fetching_guild_data = true;

            modal_data.category = null;
            modal_data.channel = null;
            modal_data.existingReadyRoom = null;

            if (modal_data.guild === data.defaultGuild.id) {
                modal_options = data.options;
                fetching_guild_data = false;
            } else {
                get_apollo().query({
                    query: Queries.GET_EVENT_CHANNEL_OPTIONS,
                    variables: {
                        guildId: modal_data.guild
                    }
                })
                .then((options) => {
                    modal_options = {
                        guilds: data.options.guilds,
                        channels: options.data.discordChannels,
                        categories: options.data.discordCategories,
                        voiceChannels: options.data.discordVoiceChannels
                    };
                })
                .catch((err) => {
                    push_notification({
                        type: "error",
                        message: "Failed to fetch data for selected guild"
                    });
                    console.error(err);
                })
                .finally(() => {
                    fetching_guild_data = false;
                });
            }
        }
    }
</script>

<Head
	title="Event Channels - Admin"
/>

<SectionHeading>
    Event Channels
</SectionHeading>
<div class="flex-1 flex flex-col justify-between" use:init_navigation>
    <div class="flex flex-col gap-4 p-4">
        <Field {validator} for="system-channels-guildid" value={"a"} required>
            <Label for="system-channels-default-channel" class="mb-2">Default Event Channel</Label>
            <div class="flex items-center gap-2">
                <Select
                    id="system-channels-default-channel"
                    name="system-channels-default-channel"
                    options={data.channels.filter(channel => channel.discordGuild.id === data.defaultGuild.id).map((channel) => ({
                        value: channel.id,
                        name: channel.discord.name,
                    })) ?? [{ value: edit_data.defaultChannel.id, name: edit_data.defaultChannel.discord?.name }]}
                    required
                    bind:value={edit_data.defaultChannel.id}
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
                The default channel where events will be posted, only event channels in the system guild can be set as the default
            </Helper>
        </Field>
    </div>
    <div class="flex justify-end gap-2 px-2 my-4">
        <Button class="shrink-0" on:click={async () => {
            modal_open = true;
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
            edit_data = clone_settings(data);
        }}>
            <CloseSolid class="me-2" tabindex="-1" /> Cancel
        </Button>
        <Button
            disabled={!is_dirty}
            on:click={() => {
                if (!is_dirty) return;
                save();
            }}
        >
            <EditOutline class="me-2" tabindex="-1" /> Save
        </Button>
    </div>
</div>

<Modal title="Create Event Channel" bind:open={modal_open} dismissable bodyClass="overflow-y-visible">
	<div class="flex flex-col gap-4 p-4">
        <Field
			{validator}
			for="system-channels-new-link-guild"
			value={modal_data.guild}
			required
		>
			<Label for="system-channels-new-link-guild" class="mb-2">Discord Guild</Label>
			<Select
                id="system-channels-new-link-guild"
                name="system-channels-new-link-guild"
                options={data.options.guilds.map((guild) => ({
                    value: guild.id,
                    name: guild.name,
                }))}
                search
                required
                bind:value={modal_data.guild}
                on:change
            />
		</Field>
        {#if fetching_guild_data}
            <div class="flex flex-col items-center gap-2 p-4">
                <span>Fetching data for selected guild...</span>
                <Spinner />
            </div>
        {:else}
            <Field
                {validator}
                for="system-channels-new-link-channel"
                value={modal_data.channel}
                required
            >
                <Label for="system-channels-new-link-channel" class="mb-2">Discord Channel</Label>
                <Select
                    id="system-channels-new-link-channel"
                    name="system-channels-new-link-channel"
                    options={modal_options.channels.filter(channel => channel.sendMessages).map((channel) => ({
                        value: channel.id,
                        name: channel.name,
                    }))}
                    search
                    required
                    bind:value={modal_data.channel}
                />
                <Helper class="mt-1">
                    Only channels the bot can send messages in will appear in this list, if a channel is not appearing the bot is probably missing permissions
                </Helper>
            </Field>
            <Field
                {validator}
                for="system-channels-new-link-category"
                value={modal_data.category}
                required
            >
                <Label for="system-channels-new-link-category" class="mb-2">Discord Category</Label>
                <Select
                    id="system-channels-new-link-category"
                    name="system-channels-new-link-category"
                    options={modal_options.categories.map((category) => ({
                        value: category.id,
                        name: category.name,
                    }))}
                    search
                    required
                    bind:value={modal_data.category}
                />
                <Helper class="mt-1">
                    The category that event voice channels will be created under
                </Helper>
            </Field>
            <div class="flex flex-col gap-2">
                <Toggle bind:checked={modal_data.showExistingReadyRoom} on:change={() => {
                    if (!modal_data.showExistingReadyRoom) modal_data.existingReadyRoom = null;
                }}>
                    Use existing ready room
                </Toggle>
                {#if modal_data.showExistingReadyRoom}
                    <Field
                        {validator}
                        for="system-channels-new-link-ready-room"
                        value={modal_data.existingReadyRoom}
                        required
                    >
                        <Label for="system-channels-new-link-ready-room" class="mb-2">Ready Room Channel</Label>
                        <Select
                            id="system-channels-new-link-ready-room"
                            name="system-channels-new-link-ready-room"
                            options={modal_options.voiceChannels.filter(vc => vc.parentId === modal_data.category).map((vc) => ({
                                value: vc.id,
                                name: vc.name,
                            }))}
                            search
                            required
                            bind:value={modal_data.existingReadyRoom}
                        />
                    </Field>
                {/if}
            </div>
        {/if}
	</div>
	<svelte:fragment slot="footer">
        <Button on:click={() => {
            create_event_channel().catch(console.error);
        }}>
            Create
        </Button>
        <Button color="alternative" on:click={() => {
            modal_open = false;
            modal_data = create_modal_data();
        }}>
            Cancel
        </Button>
  	</svelte:fragment>
</Modal>