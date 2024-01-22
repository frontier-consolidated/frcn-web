<script lang="ts">
	import { Alert, Checkbox, Helper, Input, Label, Toggle, Button } from "flowbite-svelte";
	import {
		InfoCircleSolid,
		EditOutline,
		CaretRightSolid,
		CloseSolid,
	} from "flowbite-svelte-icons";
	import DatetimePicker from "$lib/components/datetime/DatetimePicker.svelte";
	import DurationPicker from "$lib/components/datetime/DurationPicker.svelte";
	import LocationSelectUl from "$lib/components/location/LocationSelectUl.svelte";
	import BetterSelect from "$lib/components/select/BetterSelect.svelte";
	import type { PageData } from "./$types";
	import RsvpTable from "./RSVPTable.svelte";
	import MarkdownEditor from "$lib/components/markdown/MarkdownEditor.svelte";
	import { EventTypeOptions } from "$lib/data/enums";

	export let data: PageData;

	function cloneEventSettingsData(data: PageData) {
		return {
			name: data.name,
			summary: data.summary,
			description: data.description,
			eventType: data.eventType,
			location: data.location ? [...data.location] : [],
			roles: structuredClone(data.roles),
			settings: structuredClone(data.settings)!,
			startAt: data.startAt,
			duration: data.duration,
		};
	}

	type MutableData = ReturnType<typeof cloneEventSettingsData>;
	let editData = cloneEventSettingsData(data);

	function checkIfDirty(source: PageData, mutable: MutableData) {
		let clean = true;
		let diff: string[] = [];
		for (const key of Object.keys(mutable) as (keyof typeof mutable)[]) {
			switch (key) {
				case "location":
					{
						const mutableLocation = mutable.location.map((loc) => loc.name).join("/");
						const sourceLocation = source.location?.map((loc) => loc.name).join("/");
						const valueClean = mutableLocation === sourceLocation;
						if (!valueClean) diff.push(key);
						clean &&= valueClean;
					}
					break;
				case "settings":
					{
						for (const setting of Object.keys(
							mutable.settings
						) as (keyof typeof mutable.settings)[]) {
							const valueClean =
								mutable.settings[setting] === source.settings?.[setting];
							if (!valueClean) diff.push(key + "." + setting);
							clean &&= valueClean;
						}
					}
					break;
				case "roles":
					{
						const valueClean = mutable.roles.length === source.roles.length;
						if (!valueClean) diff.push(key + ".length");

						clean &&= valueClean;
						if (clean)
							for (const role of mutable.roles) {
								const sourceRole = source.roles.find((r) => r.id === role.id);
								if (sourceRole) {
									const nameClean = sourceRole.name === role.name;
									const limitClean = sourceRole.limit === role.limit;

									if (!nameClean) diff.push(key + "." + role.id + ".name");
									if (!limitClean) diff.push(key + "." + role.id + ".limit");

									clean &&= nameClean && limitClean;
								} else {
									diff.push(key + "." + role.id);
									clean = false;
								}
							}
					}
					break;
				default:
					{
						const valueClean = mutable[key] == source[key];
						if (!valueClean) diff.push(key);
						clean &&= valueClean;
					}
					break;
			}
		}
		console.log(clean, diff);
		return !clean;
	}

	function save() {
		data = { ...data, ...editData };
		editData = cloneEventSettingsData(data);
	}

	let isDirty = false;
	$: isDirty = checkIfDirty(data, editData);

	let startDate: Date | null = editData.startAt ? new Date(editData.startAt) : null;
	$: if (startDate) editData.startAt = startDate.getTime();
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
							name="type"
							options={EventTypeOptions}
							required
							bind:value={editData.eventType}
						/>
					</div>
					<div>
						<Label for="event-name" class="mb-2">Event Name</Label>
						<Input
							id="event-name"
							name="name"
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
							name="summary"
							type="text"
							placeholder="Event summary"
							required
							bind:value={editData.summary}
						/>
						<Helper class="mt-1">
							This is used on the events page and as a description in link embeds
						</Helper>
					</div>
					<Alert color="red" class="py-1">
						<span slot="icon">
							<InfoCircleSolid slot="icon" size="sm" />
							<span class="sr-only">Info</span>
						</span>
						<p class="font-medium"
							>NOTE: Event name and summary will be visible to anyone with a link to
							the event</p
						>
					</Alert>
					<div>
						<Label class="mb-2">Event Description</Label>
						<MarkdownEditor
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
						<DatetimePicker id="event-start" name="start" bind:value={startDate} />
					</div>
					<div>
						<Label for="event-duration" class="mb-2">Event Duration</Label>
						<DurationPicker
							id="event-duration"
							name="duration"
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
							options={[
								{ value: "COMMUNITY", name: "Anyone" },
								{ value: "ORG", name: "Org Members" },
								{ value: "ROLES", name: "Roles" },
							]}
							required
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
			<RsvpTable bind:value={editData.roles} />
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
				disabled={!isDirty}
				on:click={() => {
					if (!isDirty) return;
					save();
				}}
			>
				<CaretRightSolid class="me-2" /> Post
			</Button>
		{/if}
	</div>
</div>
