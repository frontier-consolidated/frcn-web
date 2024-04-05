<script lang="ts">
	import { Permission, hasPermission } from "@frcn/shared";
	import { Avatar, Dropdown, DropdownDivider, DropdownItem } from "flowbite-svelte";
	import { DotsVerticalOutline, UserRemoveSolid, ArrowLeftToBracketOutline } from "flowbite-svelte-icons";

	import { Mutations, getApollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";
	import { viewUserProfile } from "$lib/stores/UserProfileViewStore";
	import { user } from "$lib/stores/UserStore";

	import type { PageData } from "./$types";

	export let event: PageData;
	export let member: PageData["members"][number];

	$: optionsId = `event-member-options-${member.id}`
	$: role = member.rsvp ? event.rsvpRoles.find(role => role.id === member.rsvp) : null
</script>

<button class="rounded flex items-center gap-2 px-1 w-full dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700" on:click={() => {
	viewUserProfile(member.user.id)
}}>
	<Avatar rounded size="sm" src={member.user.avatarUrl} />
	<div class="flex flex-col items-start">
		<span class="text-md font-semibold text-ellipsis line-clamp-1 text-gray-800 dark:text-white">{member.user.name}</span>
		<div class="text-left text-sm font-semibold text-ellipsis line-clamp-1">
			{#if role}
				<span class="text-violet-400">
					{role.name}
				</span>
			{:else if event.owner?.id === member.user.id}
				<span class="text-blue-400">
					Event Organiser
				</span>
			{:else}
				<span class="text-gray-400">
					Event Member
				</span>
			{/if}
		</div>
	</div>
	<DotsVerticalOutline
		id={optionsId}
		class="ml-auto dark:hover:text-gray-500"
		size="sm"
		on:click={(e) => e.stopPropagation()}
	/>
</button>

<Dropdown containerClass="rounded divide-y z-50" triggeredBy="#{optionsId}">
	<DropdownItem on:click={() => {
		viewUserProfile(member.user.id)
	}}>
		View Profile
	</DropdownItem>
	{#if !event.endedAt}
		<DropdownDivider />
		{#if $user.data?.id === member.user.id}
			<DropdownItem class="flex dark:hover:bg-red-500" on:click={async () => {
				const { data: unrsvpData, errors } = await getApollo().mutate({
					mutation: Mutations.UNRSVP_FOR_EVENT,
					variables: {
						eventId: event.id
					},
					errorPolicy: "all"
				})

				if (!unrsvpData?.success || (errors && errors.length > 0)) {
					pushNotification({
						type: "error",
						message: "Failed to leave event",
					});
					console.error(errors);
					return;
				}

				event.rsvp = null;
				event.members = event.members.filter(m => m.user.id !== $user.data?.id)
			}}>
				<ArrowLeftToBracketOutline class="me-2" tabindex="-1" /> Leave Event
			</DropdownItem>
		{:else}
			{#if hasPermission($user.data?.permissions ?? 0, Permission.CreateEvents)}
				<DropdownItem class="flex dark:hover:bg-red-500" on:click={async (e) => {
					const { data: kickData, errors } = await getApollo().mutate({
						mutation: Mutations.KICK_EVENT_MEMBER,
						variables: {
							id: member.id
						},
						errorPolicy: "all"
					})

					if (!kickData?.kicked || (errors && errors.length > 0)) {
						pushNotification({
							type: "error",
							message: "Failed to kick user",
						});
						console.error(errors);
						return;
					}

					event.members = event.members.filter(m => m.id !== member.id)
				}}>
					<UserRemoveSolid class="me-2" tabindex="-1" /> Kick Member
				</DropdownItem>
			{/if}
		{/if}
	{/if}
</Dropdown>
