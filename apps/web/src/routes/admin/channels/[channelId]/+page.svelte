<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { Helper, Input, Label } from "flowbite-svelte";
	import { ArrowLeftSolid, CloseSolid, EditOutline } from "flowbite-svelte-icons";

	import { Button, Field, FieldValidator, Head, Select } from "$lib/components";
	import SectionHeading from "$lib/components/SectionHeading.svelte";
	import { Mutations, getApollo } from "$lib/graphql";
	import preventNavigation from "$lib/preventNavigation";
	import { pushNotification } from "$lib/stores/NotificationStore";

	import type { PageData } from "./$types";

	export let data: PageData;

	const validator = new FieldValidator();

	function cloneChannelData(data: PageData["channel"]) {
		return {
			channelId: data.discord.id,
			categoryId: data.discordCategory?.id,
			readyRoomName: data.readyRoomName
		};
	}

	let editData = cloneChannelData(data.channel);
	const { canNavigate, initNavigation } = preventNavigation();

	let isDirty = false;
	$: {
		isDirty =
			editData.channelId !== data.channel.discord.id ||
			editData.categoryId !== data.channel.discordCategory?.id ||
			editData.readyRoomName !== data.channel.readyRoomName;
		canNavigate.set(!isDirty);
	}

	async function save() {
		if (!validator.validate()) {
			pushNotification({
				type: "error",
				message: "Check your inputs"
			});
			return;
		}

		const { data: updatedData, errors } = await getApollo().mutate({
			mutation: Mutations.EDIT_EVENT_CHANNEL,
			variables: {
				id: data.channel.id,
				data: {
					channelId: editData.channelId,
					categoryId: editData.categoryId,
					readyRoomName: editData.readyRoomName
				}
			},
			errorPolicy: "all"
		});

		if (errors && errors.length > 0) {
			pushNotification({
				type: "error",
				message: "Failed to save"
			});
			console.error(errors);
			return;
		}

		await invalidate("app:eventchannels");
		data = {
			...data,
			channel: {
				...data.channel,
				...updatedData?.channel
			}
		} as PageData;
		editData = cloneChannelData(data.channel);
	}
</script>

<Head title="Edit Event Channel - Admin" />

<a
	class="mb-2 flex cursor-pointer items-center p-2 text-gray-300 hover:text-gray-400"
	href="/admin/channels"
>
	<ArrowLeftSolid class="me-2" tabindex="-1" /> Back to Event Channels
</a>
<SectionHeading>
	Edit Event Channel - {data.channel.discord.name}
</SectionHeading>
<div class="flex flex-1 flex-col justify-between" use:initNavigation>
	<div class="flex flex-col gap-4 p-4">
		<Field {validator} for="event-channel-ready-room-name" value={editData.readyRoomName}>
			<Label for="event-channel-ready-room-name" class="mb-2">Ready Room Name</Label>
			<Input
				class="rounded"
				id="event-channel-ready-room-name"
				name="event-channel-ready-room-name"
				type="text"
				placeholder="Event Ready Room"
				pattern="[A-Za-z]"
				bind:value={editData.readyRoomName}
			/>
		</Field>
		<Field {validator} for="event-channel-guild" value={editData.channelId} required>
			<Label for="event-channel-guild" class="mb-2">Discord Guild</Label>
			<Select
				id="event-channel-guild"
				name="event-channel-guild"
				options={data.options.guilds.map((guild) => ({
					value: guild.id,
					name: guild.name
				}))}
				search
				required
				disabled
				bind:value={data.channel.discordGuild.id}
			/>
		</Field>
		<Field {validator} for="event-channel-channel" value={editData.channelId} required>
			<Label for="event-channel-channel" class="mb-2">Discord Channel</Label>
			<Select
				id="event-channel-channel"
				name="event-channel-channel"
				options={data.options.channels
					.filter((channel) => channel.sendMessages)
					.map((channel) => ({
						value: channel.id,
						name: channel.name
					}))}
				search
				required
				bind:value={editData.channelId}
			/>
			<Helper class="mt-1">
				Only channels the bot can send messages in will appear in this list, if a channel is not
				appearing the bot is probably missing permissions
			</Helper>
		</Field>
		<Field {validator} for="event-channel-category" value={editData.categoryId} required>
			<Label for="event-channel-category" class="mb-2">Discord Category</Label>
			<Select
				id="event-channel-category"
				name="event-channel-category"
				options={data.options.categories.map((category) => ({
					value: category.id,
					name: category.name
				}))}
				search
				required
				bind:value={editData.categoryId}
			/>
			<Helper class="mt-1">The category that event voice channels will be created under</Helper>
		</Field>
	</div>
	<div class="flex items-center justify-end gap-2">
		<Button
			color="alternative"
			on:click={() => {
				editData = cloneChannelData(data.channel);
			}}
		>
			<CloseSolid class="me-2" tabindex="-1" /> Cancel
		</Button>
		<Button
			disabled={!isDirty}
			on:click={() => {
				if (!isDirty) return;
				save().catch(console.error);
			}}
		>
			<EditOutline class="me-2" tabindex="-1" /> Save
		</Button>
	</div>
</div>
