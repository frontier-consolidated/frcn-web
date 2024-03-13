<script lang="ts">
	import {
		Sidebar,
		SidebarDropdownItem,
		SidebarDropdownWrapper,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
	} from "flowbite-svelte";
	import {
		AdjustmentsHorizontalSolid,
		ArrowLeftSolid,
		ArrowLeftToBracketOutline,
		UserPlusSolid,
		UsersSolid,
	} from "flowbite-svelte-icons";
	import { twMerge } from "tailwind-merge";

	import { RsvpModal } from "$lib/components";
	import { Mutations, getApollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";
	import { user } from "$lib/stores/UserStore";

	import type { PageData } from "./$types";
	import EventSidebarMember from "./EventSidebarMember.svelte";

	export let data: PageData;

	let hideMembers = false;
	let rsvpModal = false;
</script>

<Sidebar asideClass="sticky top-0 z-10 lg:static shrink-0 lg:w-64">
	<SidebarWrapper class="py-2 lg:py-4 rounded-none lg:h-full dark:bg-slate-950">
		<ul class="flex flex-wrap [&>li]:flex-1 [&>li]:min-w-48 lg:[&>li]:min-w-0 [&>li]:w-full gap-2 lg:block lg:space-y-2">
			<SidebarItem href="/events" label="Back To Events">
				<svelte:fragment slot="icon">
					<ArrowLeftSolid tabindex="-1" />
				</svelte:fragment>
			</SidebarItem>
			{#if data.canEdit}
				<SidebarDropdownWrapper label="Manage">
					<svelte:fragment slot="icon">
						<AdjustmentsHorizontalSolid tabindex="-1" />
					</svelte:fragment>
					<SidebarDropdownItem label="Invite Members" />
					<SidebarDropdownItem label="End Event" class="dark:hover:bg-red-500" />
				</SidebarDropdownWrapper>
			{/if}
			{#if data.rsvp}
				<SidebarItem
					nonActiveClass="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white dark:hover:bg-red-500"
					label="Leave Event"
					on:click={async () => {
						const { data: unrsvpData, errors } = await getApollo().mutate({
							mutation: Mutations.UNRSVP_FOR_EVENT,
							variables: {
								eventId: data.id
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

						data.rsvp = null;
						data.members = data.members.filter(member => member.user.id !== $user.data?.id)
					}}
				>
					<svelte:fragment slot="icon">
						<ArrowLeftToBracketOutline tabindex="-1" />
					</svelte:fragment>
				</SidebarItem>
			{:else}
				<SidebarItem
					nonActiveClass="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white dark:hover:bg-primary-500"
					label="Join Event"
					on:click={() => rsvpModal = true}
				>
					<svelte:fragment slot="icon">
						<UserPlusSolid tabindex="-1" />
					</svelte:fragment>
				</SidebarItem>
			{/if}
		</ul>
		<SidebarGroup border class="overflow-y-auto hidden lg:block">
			<div class="flex items-center gap-2 dark:text-white px-2">
				<UsersSolid tabindex="-1" />
				<span class="self-center text-lg font-semibold whitespace-nowrap">
					{data.members.length} Event Member{data.members.length !== 1 ? "s" : ""}
				</span>
			</div>
			<SidebarItem
			nonActiveClass="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg bg-gray-800 dark:text-white dark:hover:bg-gray-700"
				label={hideMembers ? "Show Members" : "Hide Members"}
				on:click={() => hideMembers = !hideMembers}
			/>
			<SidebarGroup ulClass={twMerge("space-y-0", hideMembers && "hidden")}>
				{#if data.members.length > 0}
					{#each data.members as member}
						<EventSidebarMember bind:event={data} {member} />
					{/each}
				{:else}
					<span class="block text-sm text-center dark:text-gray-600">No members</span>
				{/if}
			</SidebarGroup>
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>

<RsvpModal event={data} dependency="app:currentevent" bind:open={rsvpModal} />
