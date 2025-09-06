<script lang="ts">
	import type { AnyLocation } from "@frcn/shared/locations";
	import { Avatar } from "flowbite-svelte";

	import { Button, CreatedByButton, RsvpModal } from "$lib/components";
	import { Mutations, getApollo } from "$lib/graphql";
	import { type EventFragmentFragment } from "$lib/graphql/__generated__/graphql";
	import placeholder from "$lib/images/stock/placeholder.jpg";
	import { pushNotification } from "$lib/stores/NotificationStore";
	import { user } from "$lib/stores/UserStore";

	import EventBreadcrumb from "./EventBreadcrumb.svelte";
	import EventStateBadge from "./EventStateBadge.svelte";

	export let event: Omit<EventFragmentFragment, "location"> & { location: AnyLocation[] | null };
	export let dependency: string | undefined = undefined;

	$: rsvped = event.members.find((member) => member.user?.id === $user.data?.id);
	let rsvpModalOpen = false;
</script>

<a
	href="/event/{event.id}"
	class="group/card clip-br-6 flex w-full flex-col divide-gray-200 rounded bg-white p-0 text-gray-500 shadow-md md:flex-row dark:divide-gray-700 dark:bg-gray-800 dark:text-gray-400"
>
	<img
		src={event.imageUrl ? event.imageUrl : placeholder}
		alt="Event thumbnail"
		class="h-32 rounded-t object-cover group-hover/card:brightness-110 md:h-auto md:w-36 md:rounded-none md:rounded-s"
		on:error={(e) => {
			e.currentTarget.setAttribute("src", placeholder);
		}}
	/>
	<div class="flex flex-col px-4 py-3">
		<span
			class="flex flex-col gap-2 text-xl font-semibold text-gray-800 sm:flex-row sm:items-center dark:text-white"
		>
			<EventStateBadge {event} />
			{event.name ? event.name : "Unnamed Event"}
		</span>
		<CreatedByButton class="mt-1" user={event.owner} />
		<div class="mt-2">
			<EventBreadcrumb {event} />
		</div>
		{#if event.summary}
			<div class="mt-2">
				<span class="text-md block font-semibold dark:text-white"> Summary </span>
				<span class="dark:text-gray-400">
					{event.summary}
				</span>
			</div>
		{/if}
	</div>
	<div
		class="flex shrink-0 items-end justify-between border-t border-gray-200 p-4 md:ml-auto md:w-36 md:flex-col md:items-center md:items-stretch md:border-none"
	>
		<div class="flex flex-1 flex-col md:flex-none">
			<div class="ml-4 flex justify-center">
				{#each event.members.slice(0, 3) as member (member.id)}
					<Avatar src={member.user?.avatarUrl} stacked />
				{/each}

				{#if event.members.length > 3}
					<Avatar stacked class="bg-gray-700 text-sm text-white">+{event.members.length - 3}</Avatar
					>
				{/if}
			</div>
			<span class="text-center text-sm">{event.members.length} rsvps</span>
		</div>
		{#if !event.endedAt && !event.archived}
			{#if rsvped}
				<Button
					disabled={!event.posted}
					color="red"
					class="h-max"
					on:click={async (e) => {
						e.preventDefault();

						const { data: unrsvpData, errors } = await getApollo().mutate({
							mutation: Mutations.UNRSVP_FOR_EVENT,
							variables: {
								eventId: event.id
							},
							errorPolicy: "all"
						});

						if (!unrsvpData?.success || (errors && errors.length > 0)) {
							pushNotification({
								type: "error",
								message: "Failed to unrsvp for event"
							});
							console.error(errors);
							return;
						}

						event.members = event.members.filter((member) => member.user?.id !== $user.data?.id);
					}}
				>
					UnRSVP
				</Button>
			{:else}
				<Button
					disabled={!event.posted}
					class="h-max"
					on:click={async (e) => {
						e.preventDefault();
						rsvpModalOpen = true;
					}}
				>
					RSVP
				</Button>
			{/if}
		{/if}
	</div>
</a>

<RsvpModal {event} {dependency} bind:open={rsvpModalOpen} />
