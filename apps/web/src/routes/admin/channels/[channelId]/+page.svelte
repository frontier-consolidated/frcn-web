<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { Helper, Input, Label } from "flowbite-svelte";
	import { ArrowLeftSolid, CloseSolid, EditOutline } from "flowbite-svelte-icons";

	import { Button, Field, FieldValidator, Head, Select } from "$lib/components";
	import SectionHeading from "$lib/components/SectionHeading.svelte";
	import { Mutations, get_apollo } from "$lib/graphql";
	import prevent_navigation from "$lib/preventNavigation";
	import { push_notification } from "$lib/stores/NotificationStore";

	import type { PageData } from "./$types";

	export let data: PageData;

    const validator = new FieldValidator();

    function clone_channel_data(data: PageData["channel"]) {
		return {
			channelId: data.discord.id,
            categoryId: data.discordCategory?.id,
            readyRoomName: data.readyRoomName
		};
	}

    let edit_data = clone_channel_data(data.channel);
    const { can_navigate, init_navigation } = prevent_navigation();

	let is_data = false;
	$: {
		is_data = edit_data.channelId !== data.channel.discord.id || edit_data.categoryId !== data.channel.discordCategory?.id || edit_data.readyRoomName !== data.channel.readyRoomName;
		can_navigate.set(!is_data);
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
			mutation: Mutations.EDIT_EVENT_CHANNEL,
			variables: {
				id: data.channel.id,
				data: {
					channelId: edit_data.channelId,
                    categoryId: edit_data.categoryId,
                    readyRoomName: edit_data.readyRoomName
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

		await invalidate("app:eventchannels");
		data = {
			...data, 
			channel: {
				...data.channel,
				...updated_data?.channel
			},
		} as PageData;
		edit_data = clone_channel_data(data.channel);
    }
</script>

<Head
	title="Edit Event Channel - Admin"
/>

<a class="flex items-center text-gray-300 mb-2 p-2 cursor-pointer hover:text-gray-400" href="/admin/channels">
	<ArrowLeftSolid class="me-2" tabindex="-1" /> Back to Event Channels
</a>
<SectionHeading>
    Edit Event Channel - {data.channel.discord.name}
</SectionHeading>
<div class="flex-1 flex flex-col justify-between" use:init_navigation>
	<div class="flex flex-col gap-4 p-4">
        <Field {validator} for="event-channel-ready-room-name" value={edit_data.readyRoomName}>
            <Label for="event-channel-ready-room-name" class="mb-2">Ready Room Name</Label>
            <Input
                class="rounded"
                id="event-channel-ready-room-name"
                name="event-channel-ready-room-name"
                type="text"
                placeholder="Event Ready Room"
                pattern="[A-Za-z]"
                bind:value={edit_data.readyRoomName}
            />
        </Field>
		<Field
			{validator}
			for="event-channel-guild"
			value={edit_data.channelId}
			required
		>
			<Label for="event-channel-guild" class="mb-2">Discord Guild</Label>
			<Select
                id="event-channel-guild"
                name="event-channel-guild"
                options={data.options.guilds.map((guild) => ({
                    value: guild.id,
                    name: guild.name,
                }))}
                search
                required
				disabled
                bind:value={data.channel.discordGuild.id}
            />
		</Field>
        <Field
			{validator}
			for="event-channel-channel"
			value={edit_data.channelId}
			required
		>
			<Label for="event-channel-channel" class="mb-2">Discord Channel</Label>
			<Select
                id="event-channel-channel"
                name="event-channel-channel"
                options={data.options.channels.filter(channel => channel.sendMessages).map((channel) => ({
                    value: channel.id,
                    name: channel.name,
                }))}
                search
                required
                bind:value={edit_data.channelId}
            />
            <Helper class="mt-1">
                Only channels the bot can send messages in will appear in this list, if a channel is not appearing the bot is probably missing permissions
            </Helper>
		</Field>
        <Field
			{validator}
			for="event-channel-category"
			value={edit_data.categoryId}
			required
		>
			<Label for="event-channel-category" class="mb-2">Discord Category</Label>
			<Select
                id="event-channel-category"
                name="event-channel-category"
                options={data.options.categories.map((category) => ({
                    value: category.id,
                    name: category.name,
                }))}
                search
                required
                bind:value={edit_data.categoryId}
            />
            <Helper class="mt-1">
                The category that event voice channels will be created under
            </Helper>
		</Field>
	</div>
	<div class="flex justify-end items-center gap-2">
		<Button color="alternative" on:click={() => {
			edit_data = clone_channel_data(data.channel);
		}}>
			<CloseSolid class="me-2" tabindex="-1" /> Cancel
		</Button>
		<Button
			disabled={!is_data}
			on:click={() => {
				if (!is_data) return;
				save().catch(console.error);
			}}
		>
			<EditOutline class="me-2" tabindex="-1" /> Save
		</Button>
	</div>
</div>