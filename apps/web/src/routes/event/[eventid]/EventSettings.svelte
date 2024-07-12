<script lang="ts">
	import { goto, invalidate } from "$app/navigation";
	import { strings, EventTypeOptions } from "@frcn/shared";
	import { Checkbox, Helper, Input, Label, Toggle } from "flowbite-svelte";
	import {
		EditOutline,
		CaretRightSolid,
		CloseSolid,
		ArchiveSolid,
	} from "flowbite-svelte-icons";
	import { twMerge } from "tailwind-merge";
	import isURL from "validator/lib/isURL";

	import { DatetimePicker, DurationPicker, LocationSelectInput, MarkdownEditor, ConfirmationModal, SectionHeading, Select, Field, FieldValidator, Button } from "$lib/components";
	import { Mutations, Queries, get_apollo } from "$lib/graphql";
	import { EventAccessType } from "$lib/graphql/__generated__/graphql";
	import prevent_navigation from "$lib/preventNavigation";
	import { push_notification } from "$lib/stores/NotificationStore";

	import type { PageData } from "./$types";
	import RsvpTable from "./RSVPTable.svelte";
	import { check_if_dirty, clone_event_settings_data } from "./settings";

	const url_pattern =
		"[Hh][Tt][Tt][Pp][Ss]?://(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::d{2,5})?(?:/[^s]*)?";

	export let data: PageData;
	let edit_data = clone_event_settings_data(data);

	const { can_navigate, init_navigation } = prevent_navigation();

	let is_dirty = false;
	$: {
		is_dirty = check_if_dirty(data, edit_data);
		can_navigate.set(!is_dirty);
	}

	$: canEdit = !data.archived && !data.endedAt;

	let start_date: Date | null = edit_data.startAt ? new Date(edit_data.startAt) : null;
	$: if (start_date) edit_data.startAt = start_date.getTime();

	let image_placeholder = false;
	let validator = new FieldValidator();

	let delete_modal_open = false;
	let archive_modal_open = false;

	async function save(notify_success = true) {
		if (!validator.validate(!data.posted)) {
			push_notification({
				type: "error",
				message: "Check your inputs",
			});
			return false;
		}
		if (edit_data.location.some(loc => !loc)) {
			push_notification({
				type: "error",
				message: "Invalid location",
			});
			return false;
		}
		
		const { errors } = await get_apollo().mutate({
			mutation: Mutations.EDIT_EVENT,
			variables: {
				eventId: data.id,
				data: {
					channel: edit_data.channel.id ? edit_data.channel.id : undefined,
					name: edit_data.name ? edit_data.name : undefined,
					summary: edit_data.summary ? edit_data.summary : undefined,
					description: edit_data.description ? edit_data.description.slice(0, 2024) : undefined,
					imageUrl: edit_data.imageUrl,
					eventType: edit_data.eventType,
					location: edit_data.location.map((loc) => loc.name),
					startAt: edit_data.startAt,
					duration: edit_data.duration,
					roles: edit_data.rsvpRoles.map((r) => ({
						id: r.id,
						name: r.name,
						limit: r.limit,
						emoji: r.emoji.name,
						emojiId: r.emoji.id,
					})),
					mentions: edit_data.mentions,
					settings: {
						createEventThread: edit_data.settings.createEventThread,
						hideLocation: edit_data.settings.hideLocation,
						inviteOnly: edit_data.settings.inviteOnly,
						openToJoinRequests: edit_data.settings.openToJoinRequests,
					},
					accessType: edit_data.accessType,
					accessRoles: edit_data.accessRoles.map((role) => role.id),
				},
			},
			errorPolicy: "all",
		});

		if (errors && errors.length > 0) {
			push_notification({
				type: "error",
				message: "Failed to save",
			});
			console.error(errors);
			return false;
		}

		await invalidate("app:currentevent");

		if (notify_success) {
			push_notification({
				type: "success",
				message: "Event successfully saved!",
			});
		}
		return true;
	}

	async function post() {
		if (!validator.validate()) {
			push_notification({
				type: "error",
				message: "Check your inputs",
			});
			return false;
		}
		if (is_dirty && !(await save(false))) return false;

		const { data: post_data, errors } = await get_apollo().mutate({
			mutation: Mutations.POST_EVENT,
			variables: {
				eventId: data.id,
			},
			errorPolicy: "all",
		});

		if (!post_data?.success || (errors && errors.length > 0)) {
			push_notification({
				type: "error",
				message: "Failed to post",
			});
			console.error(errors);
			return false;
		}

		await invalidate("app:currentevent");
		push_notification({
			type: "success",
			message: "Event successfully posted!",
		});
		return true;
	}

	let guild_options = data.options;

	let previous_event_channel_id = edit_data.channel.id;
	let fetching_guild_data = false;
	$: {
		if (data.options && edit_data.channel.id !== previous_event_channel_id) {
			previous_event_channel_id = edit_data.channel.id;
			fetching_guild_data = true;

			edit_data.mentions = [];

			edit_data.channel = data.options.channels.find(channel => channel.id === edit_data.channel.id) ?? edit_data.channel;
			
			if (edit_data.channel.id === data.channel?.id) {
				guild_options = data.options;
				fetching_guild_data = false;
			} else if ("id" in edit_data.channel.discordGuild) {
				get_apollo().query({
                    query: Queries.GET_EVENT_SETTINGS_CHANNEL_OPTIONS,
                    variables: {
                        guildId: edit_data.channel.discordGuild.id
                    }
                })
                .then((options) => {
					guild_options = {
						channels: data.options!.channels,
						emojis: data.options!.emojis,
						discordRoles: options.data.discordRoles
					};
                })
                .catch((err) => {
                    push_notification({
                        type: "error",
                        message: "Failed to fetch data for selected event channel"
                    });
                    console.error(err);
                })
                .finally(() => {
                    fetching_guild_data = false;
                });
			} else {
				guild_options = {
					channels: data.options.channels,
					emojis: data.options.emojis,
					discordRoles: []
				};
				fetching_guild_data = false;
			}
		}
	}
</script>

<div class="flex flex-col md:grid md:grid-cols-2 md:gap-6" use:init_navigation>
	<div>
		<section>
			<SectionHeading>
				General Settings
			</SectionHeading>
			<div class="flex flex-col gap-4 p-4">
				<Field {validator} for="event-type" value={edit_data.eventType} required>
					<Label for="event-type" class="mb-2">Event Type</Label>
					<Select
						id="event-type"
						name="event-type"
						options={EventTypeOptions}
						required
						disabled={!canEdit}
						bind:value={edit_data.eventType}
					/>
				</Field>
				<Field {validator} for="event-name" value={edit_data.name} required>
					<Label for="event-name" class="mb-2">Event Name</Label>
					<Input
						id="event-name"
						name="event-name"
						type="text"
						placeholder="Event name"
						required
						maxlength="255"
						autocomplete="new-password"
						class="rounded"
						disabled={!canEdit}
						bind:value={edit_data.name}
					/>
				</Field>
				<Field {validator} for="event-summary" value={edit_data.summary} required>
					<Label for="event-summary" class="mb-2">Event Summary</Label>
					<Input
						id="event-summary"
						name="event-summary"
						type="text"
						placeholder="Event summary"
						required
						maxlength="255"
						autocomplete="new-password"
						class="rounded"
						disabled={!canEdit}
						bind:value={edit_data.summary}
					/>
					<Helper class="mt-1">
						This is used on the events page and as a description in link embeds
					</Helper>
				</Field>
				<Field {validator} for="event-image" value={edit_data.imageUrl} validate={(value) => {
					if (!value) return [true, null];
					const valid = isURL(value, {
						require_protocol: true,
						require_valid_protocol: true,
						protocols: ["https"],
						validate_length: true,
					});
					if (valid) return [true, null];
					return [false, "Not a valid or allowed image url"];
				}}>
					<Label for="event-image" class="mb-2">Event Image</Label>
					<Input
						id="event-image"
						name="event-image"
						type="text"
						placeholder="https://example.com/image.png"
						pattern={url_pattern}
						required
						maxlength="2084"
						autocomplete="new-password"
						class="rounded"
						disabled={!canEdit}
						bind:value={edit_data.imageUrl}
					/>
					{#if edit_data.imageUrl}
						<div class="mt-2">
							<img src={edit_data.imageUrl} alt="Event thumbnail" class={twMerge("rounded h-48", image_placeholder ? "hidden" : undefined)} on:error={() => {
								image_placeholder = true;
							}} on:load={() => {
								image_placeholder = false;
							}} />
							<div role="status" class={twMerge("animate-pulse flex justify-center items-center w-full h-48 bg-gray-300 rounded dark:bg-gray-700", image_placeholder ? undefined : "hidden")}>
								<svg width="48" height="48" class="text-gray-200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512">
									<path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
								</svg>
							</div>
						</div>
					{/if}
				</Field>
				<Field {validator} for="event-description" value={edit_data.description}>
					<Label for="event-description" class="mb-2">Event Description</Label>
					<MarkdownEditor
						maxlength="2048"
						placeholder="Describe the event"
						disabled={!canEdit}
						bind:value={edit_data.description}
					/>
				</Field>
			</div>
		</section>
	</div>
	<div>
		<section>
			<SectionHeading>
				Event Time
			</SectionHeading>
			<div class="flex flex-col gap-4 p-4">
				<Field {validator} for="event-start" value={start_date} required>
					<Label for="event-start" class="mb-2">Event Start</Label>
					<DatetimePicker
						id="event-start"
						name="event-start"
						disable="past"
						disabled={!canEdit}
						bind:value={start_date}
					/>
				</Field>
				<Field {validator} for="event-duration" value={edit_data.duration} required>
					<Label for="event-duration" class="mb-2">Event Duration</Label>
					<DurationPicker
						id="event-duration"
						name="event-duration"
						disabled={!canEdit}
						bind:value={edit_data.duration}
					/>
				</Field>
			</div>
		</section>
		<section>
			<SectionHeading>
				Event Location
			</SectionHeading>
			<div class="flex flex-col gap-4 p-4">
				<Field {validator} for="event-hide-location" value={edit_data.settings.hideLocation}>
					<Checkbox id="event-hide-location" disabled={!canEdit} bind:checked={edit_data.settings.hideLocation}>
						Hide Location
					</Checkbox>
					<Helper>
						If enabled, the event location will only be shown to users once the event starts
					</Helper>
				</Field>
				<Field {validator} for="event-location" value={edit_data.location}>
					<LocationSelectInput id="event-location" disabled={!canEdit} bind:value={edit_data.location} />
				</Field>
			</div>
		</section>
		<section>
			<SectionHeading>
				Join Permissions
			</SectionHeading>
			<div class="flex flex-col gap-4 p-4">
				<Field {validator} for="event-access" value={edit_data.accessType}>
					<Label for="event-access" class="mb-2">Event Access</Label>
					<Select
						id="event-access"
						name="event-access"
						options={[EventAccessType.Channel, EventAccessType.Everyone].map((type) => ({
							value: type,
							name: strings.toTitleCase(type),
						}))}
						required
						disabled={!canEdit}
						bind:value={edit_data.accessType}
					/>
				</Field>
				<!-- <Field {validator} for="event-require-invite" value={editData.settings.inviteOnly}>
					<Toggle id="event-require-invite" disabled={!canEdit} bind:checked={editData.settings.inviteOnly}>
						Require Invite to Join
					</Toggle>
					<Helper class="mt-1">
						Selected users will have to request an invitation to join
					</Helper>
				</Field>
				<Field {validator} for="event-open-to-requests" value={editData.settings.openToJoinRequests}>
					{#key editData.settings.inviteOnly}
						<Toggle
							id="event-open-to-requests"
							disabled={!editData.settings.inviteOnly || !canEdit}
							bind:checked={editData.settings.openToJoinRequests}
						>
							Open to Join Requests
						</Toggle>
					{/key}
					<Helper class="mt-1">Selected users can request to join the event</Helper>
				</Field> -->
			</div>
		</section>
		<section>
			<SectionHeading>
				Discord Settings
			</SectionHeading>
			<div class="flex flex-col gap-4 p-4">
				<Field {validator} for="event-channel" value={edit_data.channel.id} required>
					<Label for="event-channel" class="mb-2">Events Channel</Label>
					<Select
						id="event-channel"
						name="event-channel"
						options={data.options?.channels.map((channel) => ({
							value: channel.id,
							name: `${channel.discordGuild.name} > ${channel.discord.name}`,
						})) ?? [{ value: edit_data.channel.id, name: `${edit_data.channel.discordGuild.name} > ${edit_data.channel.discord.name}` }]}
						required
						disabled={!canEdit}
						bind:value={edit_data.channel.id}
					/>
				</Field>
				<Field {validator} for="event-mentions" value={edit_data.mentions}>
					<Label for="event-mentions" class="mb-2">Mentions</Label>
					<Select
						id="event-mentions"
						name="event-mentions"
						options={guild_options?.discordRoles.map(role => ({
							value: role.id,
							name: role.name,
							style: {
								color: role.color === "#000000" ? "#e5e7eb" : role.color
							}
						}))}
						required
						multi
						search
						max={10}
						disabled={!canEdit || fetching_guild_data}
						bind:value={edit_data.mentions}
						let:option
					>
						<div class="flex items-center">
							<div class="rounded-full w-3 h-3 me-2" style="background-color:{option.style?.color}" />
							<span>{option.name}</span>
						</div>
					</Select>
				</Field>
				<Field {validator} for="event-create-thread" value={edit_data.settings.createEventThread}>
					<Toggle id="event-create-thread" disabled={!canEdit || data.posted} bind:checked={edit_data.settings.createEventThread}>
						Create Event Thread
					</Toggle>
					<Helper class="mt-1">
						No discord thread will be created if disabled
					</Helper>
				</Field>
			</div>
		</section>
	</div>
</div>
<section>
	<SectionHeading>
		Event RSVPs
	</SectionHeading>
	<div class="py-4 sm:px-4">
		<RsvpTable id="event-rsvps" {validator} {data} disabled={!canEdit} bind:value={edit_data.rsvpRoles} />
	</div>
</section>
<div class="flex flex-wrap justify-end items-center gap-2">
	{#if start_date && start_date <= new Date()}
		<Button disabled={data.archived} color="dark" class="mr-auto" on:click={() => {
			if (data.archived) return;
			archive_modal_open = true;
		}}>
			<ArchiveSolid class="me-2" tabindex="-1" /> Archive
		</Button>
	{:else}
		<Button color="red" class="mr-auto" on:click={() => {
			delete_modal_open = true;
		}}>
			<CloseSolid class="me-2" tabindex="-1" /> Delete
		</Button>
	{/if}
	<Button color="alternative" on:click={() => {
		if (data.createdAt === data.updatedAt) {
			delete_modal_open = true;
		} else {
			edit_data = clone_event_settings_data(data);
		}
	}}>
		<CloseSolid class="me-2" tabindex="-1" /> Cancel
	</Button>
	{#if data.posted}
		<Button
			disabled={!is_dirty || !canEdit}
			on:click={() => {
				if (!is_dirty || !canEdit) return;
				save();
			}}
		>
			<EditOutline class="me-2" tabindex="-1" /> Save
		</Button>
	{:else}
		<Button
			color="green"
			disabled={!is_dirty}
			on:click={() => {
				if (!is_dirty) return;
				save();
			}}
		>
			<EditOutline class="me-2" tabindex="-1" /> Save Draft
		</Button>
		<Button
			disabled={data.posted}
			on:click={() => {
				if (data.posted) return;
				post();
			}}
		>
			<CaretRightSolid class="me-2" tabindex="-1" /> Post
		</Button>
	{/if}
</div>

<ConfirmationModal title="Delete event" bind:open={delete_modal_open} on:confirm={async () => {
    const { errors } = await get_apollo().mutate({
        mutation: Mutations.DELETE_EVENT,
        variables: {
            id: data.id
        },
		errorPolicy: "all",
    });

    if (errors && errors.length > 0) {
        push_notification({
            type: "error",
            message: "Failed to delete event",
        });
        console.error(errors);
        return;
    }

    delete_modal_open = false;
	goto("/events");
}}>
    <span>Are you sure you want to delete this event? Once deleted it cannot be undone.</span>
</ConfirmationModal>

<ConfirmationModal title="Archive event" bind:open={archive_modal_open} on:confirm={async () => {
    const { errors } = await get_apollo().mutate({
        mutation: Mutations.ARCHIVE_EVENT,
        variables: {
            id: data.id
        },
		errorPolicy: "all",
    });

    if (errors && errors.length > 0) {
        push_notification({
            type: "error",
            message: "Failed to archive event",
        });
        console.error(errors);
        return;
    }

    archive_modal_open = false;
	await invalidate("app:currentevent");
}}>
    <p>Are you sure you want to archive this event?</p>
	{#if !data.endedAt}
		<p>This event has not been ended, archiving the event will end the event.</p>
	{/if}
</ConfirmationModal>
