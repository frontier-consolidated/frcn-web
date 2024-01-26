<script lang="ts">
	import { Alert, Checkbox, Helper, Input, Label, Toggle, Button } from "flowbite-svelte";
	import {
		InfoCircleSolid,
		EditOutline,
		CaretRightSolid,
		CloseSolid,
	} from "flowbite-svelte-icons";
	import { strings, EventTypeOptions } from "@frcn/shared";
	import DatetimePicker from "$lib/components/datetime/DatetimePicker.svelte";
	import DurationPicker from "$lib/components/datetime/DurationPicker.svelte";
	import LocationSelectUl from "$lib/components/location/LocationSelectUl.svelte";
	import BetterSelect from "$lib/components/select/BetterSelect.svelte";
	import MarkdownEditor from "$lib/components/markdown/MarkdownEditor.svelte";
	import type { PageData } from "./$types";
	import RsvpTable from "./RSVPTable.svelte";
	import { Mutations, apollo } from "$lib/graphql";
	import { checkIfDirty, cloneEventSettingsData } from "./settings";
	import { getLocations } from "$lib/data/locations";
	import { pushNotification } from "$lib/stores/NotificationStore";
	import { EventAccessType } from "$lib/graphql/__generated__/graphql";

	const urlPattern =
		"[Hh][Tt][Tt][Pp][Ss]?://(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::d{2,5})?(?:/[^s]*)?";

	export let data: PageData;
	let editData = cloneEventSettingsData(data);

	let isDirty = false;
	$: isDirty = checkIfDirty(data, editData);

	let startDate: Date | null = editData.startAt ? new Date(editData.startAt) : null;
	$: if (startDate) editData.startAt = startDate.getTime();

	async function save() {
		const { data: updatedData, errors } = await apollo.mutate({
			mutation: Mutations.EDIT_EVENT,
			variables: {
				eventId: data.id,
				data: {
					channel: editData.channel.id,
					name: editData.name,
					summary: editData.summary,
					description: editData.description,
					imageUrl: editData.imageUrl,
					eventType: editData.eventType!,
					location: editData.location.map((loc) => loc.name),
					startAt: editData.startAt!,
					duration: editData.duration!,
					roles: editData.roles.map((r) => ({
						id: r.id,
						name: r.name,
						limit: r.limit,
						emoji: r.emoji.name,
						emojiId: r.emoji.id,
					})),
					mentions: editData.mentions.map((mention) => mention.id),
					settings: {
						hideLocation: editData.settings.hideLocation,
						inviteOnly: editData.settings.inviteOnly,
						openToJoinRequests: editData.settings.openToJoinRequests,
						allowCrewSwitching: editData.settings.allowCrewSwitching,
						allowTeamSwitching: editData.settings.allowTeamSwitching,
					},
					accessType: editData.accessType,
					accessRoles: editData.accessRoles.map((role) => role.id),
				},
			},
			errorPolicy: "all",
		});

		if (errors && errors.length > 0) {
			pushNotification({
				type: "error",
				message: "Failed to save",
			});
			console.error(errors);
			return false;
		}

		const location = updatedData?.event?.location
			? getLocations(updatedData?.event?.location)
			: null;
		data = { ...data, ...updatedData?.event, location } as PageData;
		editData = cloneEventSettingsData(data);
		return true;
	}

	async function post() {
		if (isDirty) {
			if (!(await save())) return;
		}

		const { data: postData, errors } = await apollo.mutate({
			mutation: Mutations.POST_EVENT,
			variables: {
				eventId: data.id,
			},
			errorPolicy: "all",
		});

		if (!postData?.success || (errors && errors.length > 0)) {
			pushNotification({
				type: "error",
				message: "Failed to post",
			});
			console.error(errors);
			return false;
		}

		window.location.reload();
		return true;
	}
</script>

<div>
	<div class="flex flex-col lg:grid lg:grid-cols-2 lg:gap-6">
		<div>
			<section>
				<span class="text-lg font-semibold dark:text-primary-500"> General Settings </span>
				<div class="w-full h-0.5 dark:bg-primary-500 mt-1"></div>
				<div class="flex flex-col gap-4 p-4">
					<div>
						<Label for="event-type" class="mb-2">Event Type</Label>
						<BetterSelect
							id="event-type"
							name="Event Type"
							options={EventTypeOptions}
							required
							bind:value={editData.eventType}
						/>
					</div>
					<div>
						<Label for="event-name" class="mb-2">Event Name</Label>
						<Input
							id="event-name"
							name="Event Name"
							type="text"
							placeholder="Event name"
							required
							bind:value={editData.name}
						/>
					</div>
					<div>
						<Label for="event-summary" class="mb-2">Event Summary</Label>
						<Input
							id="event-summary"
							name="Event Summary"
							type="text"
							placeholder="Event summary"
							required
							bind:value={editData.summary}
						/>
						<Helper class="mt-1">
							This is used on the events page and as a description in link embeds
						</Helper>
					</div>
					<div>
						<Label for="event-image" class="mb-2">Event Image</Label>
						<Input
							id="event-image"
							name="Event Image"
							type="text"
							placeholder="https://example.com/image.png"
							pattern={urlPattern}
							required
							bind:value={editData.imageUrl}
						/>
					</div>
					<Alert color="red" class="py-1">
						<span slot="icon">
							<InfoCircleSolid slot="icon" size="sm" />
							<span class="sr-only">Info</span>
						</span>
						<p class="font-medium"
							>NOTE: Event name, summary and image will be visible to anyone with a
							link to the event</p
						>
					</Alert>
					<div>
						<Label for="event-description" class="mb-2">Event Description</Label>
						<MarkdownEditor
							id="event-description"
							name="Event Description"
							placeholder="Describe the event"
							bind:value={editData.description}
						/>
					</div>
				</div>
			</section>
			<section>
				<span class="text-lg font-semibold dark:text-primary-500"> Event Time </span>
				<div class="w-full h-0.5 dark:bg-primary-500 mt-1"></div>
				<div class="flex flex-col gap-4 p-4">
					<div>
						<Label for="event-start" class="mb-2">Event Start</Label>
						<DatetimePicker
							id="event-start"
							name="Event Start Datetime"
							disable="past"
							bind:value={startDate}
						/>
					</div>
					<div>
						<Label for="event-duration" class="mb-2">Event Duration</Label>
						<DurationPicker
							id="event-duration"
							name="Event Duration"
							bind:value={editData.duration}
						/>
					</div>
				</div>
			</section>
		</div>
		<div>
			<section>
				<span class="text-lg font-semibold dark:text-primary-500"> Event Location </span>
				<div class="w-full h-0.5 dark:bg-primary-500 mt-1"></div>
				<div class="flex flex-col gap-4 p-4">
					<div>
						<Checkbox bind:checked={editData.settings.hideLocation}
							>Hide Location</Checkbox
						>
						<Helper
							>If enabled, the event location will only be shown to users once they
							join the event</Helper
						>
					</div>
					<LocationSelectUl bind:value={editData.location} />
				</div>
			</section>
			<section>
				<span class="text-lg font-semibold dark:text-primary-500">
					Event Join Permissions
				</span>
				<div class="w-full h-0.5 dark:bg-primary-500 mt-1"></div>
				<div class="flex flex-col gap-4 p-4">
					<div>
						<Label for="event-access" class="mb-2">Event Access</Label>
						<BetterSelect
							id="event-access"
							name="type"
							options={Object.values(EventAccessType).map((type) => ({
								value: type,
								name: strings.toTitleCase(type),
							}))}
							required
							bind:value={editData.accessType}
						/>
					</div>
					<div>
						<Toggle bind:checked={editData.settings.inviteOnly}
							>Require Invite to Join</Toggle
						>
						<Helper class="mt-1">
							Selected users will have to request an invitation to join
						</Helper>
					</div>
					<div>
						{#key editData.settings.inviteOnly}
							<Toggle
								disabled={!editData.settings.inviteOnly}
								bind:checked={editData.settings.openToJoinRequests}
								>Open to Join Requests</Toggle
							>
						{/key}
						<Helper class="mt-1">Selected users can request to join the event</Helper>
					</div>
				</div>
			</section>
			<section>
				<span class="text-lg font-semibold dark:text-primary-500"
					>Event Member Permissions</span
				>
				<div class="w-full h-0.5 dark:bg-primary-500 mt-1"></div>
				<div class="flex flex-col gap-4 p-4">
					<div>
						<Toggle bind:checked={editData.settings.allowTeamSwitching}
							>Allow Team Switching</Toggle
						>
						<Helper class="mt-1">
							Users will be able to switch teams once the event has started
						</Helper>
					</div>
					<div>
						<Toggle bind:checked={editData.settings.allowCrewSwitching}
							>Allow Crew Switching</Toggle
						>
						<Helper class="mt-1">
							Users will be able to switch crews once the event has started
						</Helper>
					</div>
				</div>
			</section>
		</div>
	</div>
	<section>
		<span class="text-lg font-semibold dark:text-primary-500">Event RSVPs</span>
		<div class="w-full h-0.5 dark:bg-primary-500 mt-1"></div>
		<div class="p-4">
			<RsvpTable {data} bind:value={editData.roles} />
		</div>
	</section>
	<div class="flex justify-end items-center gap-2">
		{#if data.posted}
			<Button
				disabled={!isDirty}
				on:click={() => {
					if (!isDirty) return;
					save();
				}}
			>
				<EditOutline class="me-2" /> Save
			</Button>
		{:else}
			<Button color="alternative">
				<CloseSolid class="me-2" /> Cancel
			</Button>
			<Button
				color="green"
				disabled={!isDirty}
				on:click={() => {
					if (!isDirty) return;
					save();
				}}
			>
				<EditOutline class="me-2" /> Save Draft
			</Button>
			<Button
				disabled={data.posted}
				on:click={() => {
					if (data.posted) return;
					post();
				}}
			>
				<CaretRightSolid class="me-2" /> Post
			</Button>
		{/if}
	</div>
</div>
