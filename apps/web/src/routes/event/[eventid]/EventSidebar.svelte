<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { hasPermission, Permission } from "@frcn/shared";
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from "flowbite-svelte";
	import {
		ArrowLeftSolid,
		ArrowLeftToBracketOutline,
		EyeSlashSolid,
		EyeSolid,
		FileExportSolid,
		UserPlusSolid,
		UsersSolid
	} from "flowbite-svelte-icons";

	import { RsvpModal } from "$lib/components";
	import { Mutations, getApollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";
	import { user } from "$lib/stores/UserStore";

	import type { PageData } from "./$types";
	import EventMember from "./EventMember.svelte";
	import SidebarButton from "./SidebarButton.svelte";

	export let data: PageData;

	let exporting = false;
	function exportMembers(allData = false) {
		if (exporting) return;
		exporting = true;

		const csv = [];

		for (const member of data.members) {
			if (!member.user) continue;

			if (allData) {
				const rsvpRole = data.rsvpRoles.find((role) => role.id === member.rsvp);
				csv.push([
					member.user.name,
					member.user.discordName,
					member.user.discordUsername,
					rsvpRole?.name ?? "!ERROR"
				]);
			} else {
				csv.push([member.user.name]);
			}
		}

		csv.sort((a, b) => a[0].localeCompare(b[0]));

		if (allData) {
			csv.unshift(["Display Name", "Discord Nickname", "Discord Username", "RSVP"]);
		} else {
			csv.unshift(["Name"]);
		}

		const csvContent = csv
			.map((row) => row.map((value) => JSON.stringify(value)).join(","))
			.join("\n");
		const blob = new Blob([csvContent], {
			type: "text/csv;charset=utf-8"
		});

		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = `${data.id}-event-members.csv`;
		link.click();

		link.remove();
		URL.revokeObjectURL(url);

		exporting = false;
	}

	let hideMembers = false;
	let rsvpModal = false;
</script>

<Sidebar asideClass="z-10 shrink-0 lg:w-72 lg:-mb-12">
	<SidebarWrapper
		class="py-2 lg:py-4 rounded-none lg:h-full bg-transparent dark:bg-transparent lg:bg-zinc-100 lg:dark:bg-slate-900 bg-cover"
	>
		<ul
			class="flex flex-wrap [&>li]:flex-1 [&>li]:min-w-48 lg:[&>li]:min-w-0 [&>li]:w-full gap-2 lg:block lg:space-y-2"
		>
			<SidebarItem class="rounded clip-opposite-4" href="/events" label="Back To Events">
				<svelte:fragment slot="icon">
					<ArrowLeftSolid tabindex="-1" />
				</svelte:fragment>
			</SidebarItem>
			{#if data.canEdit && !data.endedAt && data.startAt && new Date(data.startAt) <= new Date()}
				<SidebarItem
					label="End Event"
					class="rounded clip-opposite-4 dark:hover:bg-red-500"
					on:click={async () => {
						const { data: endData, errors } = await getApollo().mutate({
							mutation: Mutations.END_EVENT,
							variables: {
								id: data.id
							}
						});

						if (!endData?.ended || (errors && errors.length > 0)) {
							pushNotification({
								type: "error",
								message: "Failed to end event"
							});
							console.error(errors);
							return;
						}

						await invalidate("app:currentevent");
						pushNotification({
							type: "success",
							message: "Successfully ended the event"
						});
					}}
				/>
			{/if}
			{#if !data.endedAt}
				{#if data.rsvp}
					<SidebarItem
						class="rounded clip-opposite-4"
						nonActiveClass="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:text-white hover:bg-red-500"
						label="Leave Event"
						on:click={async () => {
							const { data: unrsvpData, errors } = await getApollo().mutate({
								mutation: Mutations.UNRSVP_FOR_EVENT,
								variables: {
									eventId: data.id
								}
							});

							if (!unrsvpData?.success || (errors && errors.length > 0)) {
								pushNotification({
									type: "error",
									message: "Failed to leave event"
								});
								console.error(errors);
								return;
							}

							data.rsvp = null;
							data.members = data.members.filter(
								(member) => member.user?.id !== $user.data?.id
							);
						}}
					>
						<svelte:fragment slot="icon">
							<ArrowLeftToBracketOutline tabindex="-1" />
						</svelte:fragment>
					</SidebarItem>
				{:else}
					<SidebarItem
						class="rounded clip-opposite-4"
						nonActiveClass="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white dark:hover:bg-primary-500"
						label="Join Event"
						on:click={() => (rsvpModal = true)}
					>
						<svelte:fragment slot="icon">
							<UserPlusSolid tabindex="-1" />
						</svelte:fragment>
					</SidebarItem>
				{/if}
			{/if}
		</ul>
		<SidebarGroup border class="overflow-y-auto hidden lg:block">
			<div class="flex items-center gap-2 dark:text-white px-2">
				<UsersSolid tabindex="-1" />
				<span class="self-center text-lg font-semibold whitespace-nowrap">
					{data.members.length} Event Member{data.members.length !== 1 ? "s" : ""}
				</span>
			</div>
			<SidebarButton on:click={() => (hideMembers = !hideMembers)}>
				<svelte:fragment slot="icon">
					<svelte:component
						this={hideMembers ? EyeSolid : EyeSlashSolid}
						size="sm"
						tabindex="-1"
					/>
				</svelte:fragment>
				{hideMembers ? "Show Members" : "Hide Members"}
			</SidebarButton>
			{#if data.canEdit || hasPermission($user.data?.__permissions ?? 0, Permission.CreateEvents)}
				<SidebarButton
					on:click={(e) => {
						exportMembers(e.altKey);
					}}
				>
					<svelte:fragment slot="icon">
						<FileExportSolid size="sm" tabindex="-1" />
					</svelte:fragment>
					Export members
				</SidebarButton>
			{/if}
			<!-- <SidebarButton class="text-white bg-primary-500 hover:bg-primary-600 dark:bg-primary-700 dark:hover:bg-primary-600">
				<PlusSolid slot="icon" size="sm" tabindex="-1" />
				Create Team
			</SidebarButton> -->
			<SidebarGroup ulClass={hideMembers ? "hidden" : ""}>
				<!-- <EventTeam bind:event={data} /> -->
				{#if data.members.length > 0}
					{#each data.members as member}
						<EventMember bind:event={data} {member} />
					{/each}
				{:else}
					<span class="block text-sm text-center text-gray-400 dark:text-gray-600"
						>No members</span
					>
				{/if}
			</SidebarGroup>
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>

<RsvpModal event={data} dependency="app:currentevent" bind:open={rsvpModal} />
