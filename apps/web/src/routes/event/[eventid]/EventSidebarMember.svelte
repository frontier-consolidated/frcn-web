<script lang="ts">
	import { Permission, hasPermission } from "@frcn/shared";
	import { Avatar, Dropdown, DropdownDivider, DropdownItem } from "flowbite-svelte";
	import { DotsVerticalOutline, UserRemoveSolid, UserGroupSolid, ArrowLeftToBracketOutline } from "flowbite-svelte-icons";

	import { Mutations, getApollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";
	import { userProfileView } from "$lib/stores/UserProfileViewStore";
	import { user } from "$lib/stores/UserStore";

	import type { PageData } from "./$types";

	export let event: PageData;
	export let member: PageData["members"][number];

	$: role = member.rsvp ? event.roles.find(role => role.id === member.rsvp) : null
</script>

<button class="rounded flex items-center gap-2 px-1 w-full dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700" on:click={() => {
	userProfileView.set(member.user)
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
		class="ml-auto dark:hover:text-gray-500"
		size="sm"
		on:click={(e) => e.stopPropagation()}
	/>
	<Dropdown>
		<DropdownItem on:click={(e) => {
			e.stopPropagation()
			userProfileView.set(member.user)
		}}>
			View Profile
		</DropdownItem>
		<DropdownDivider />
		{#if $user.data?.id === member.user.id}
			<DropdownItem class="flex dark:hover:bg-red-500" on:click={async (e) => {
				e.stopPropagation()

				const { data: unrsvpData, errors } = await getApollo().mutate({
					mutation: Mutations.UNRSVP_FOR_EVENT,
					variables: {
						eventId: event.id
					}
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
				event.members = event.members.filter(member => member.user.id !== $user.data?.id)
			}}>
				<ArrowLeftToBracketOutline class="me-2" tabindex="-1" /> Leave Event
			</DropdownItem>
		{:else}
			<DropdownItem class="flex">
				<UserGroupSolid class="me-2" tabindex="-1" /> Join {member.user.name}'s crew
			</DropdownItem>
			<DropdownItem class="flex">
				<UserGroupSolid class="me-2" tabindex="-1" /> Add to my crew
			</DropdownItem>
			{#if (event.owner && $user.data?.id === event.owner?.id) || hasPermission($user.data?.permissions ?? 0, Permission.CreateEvents)}
				<DropdownItem class="flex dark:hover:bg-red-500">
					<UserRemoveSolid class="me-2" tabindex="-1" /> Kick Member
				</DropdownItem>
			{/if}
		{/if}
	</Dropdown>
</button>
