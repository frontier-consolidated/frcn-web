<script lang="ts">
	import {
	Button,
	Label,
		Modal,
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

	import BetterSelect from "$lib/components/select/BetterSelect.svelte";

	import type { PageData } from "./$types";
	import EventMember from "./EventMember.svelte";

	export let data: PageData;

	let rsvpModal = false;
	let rsvpRole: string;
</script>

<Sidebar asideClass="shrink-0 hidden lg:block w-64 max-h-screen">
	<SidebarWrapper>
		<SidebarGroup>
			<SidebarItem href="/events" label="Back To Events">
				<svelte:fragment slot="icon">
					<ArrowLeftSolid />
				</svelte:fragment>
			</SidebarItem>
			{#if data.canEdit}
				<SidebarDropdownWrapper label="Manage">
					<svelte:fragment slot="icon">
						<AdjustmentsHorizontalSolid />
					</svelte:fragment>
					<SidebarDropdownItem label="Invite Members" />
					<SidebarDropdownItem label="End Event" class="dark:hover:bg-red-500" />
				</SidebarDropdownWrapper>
			{/if}
			{#if data.rsvp}
				<SidebarItem
					nonActiveClass="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white dark:hover:bg-red-500"
					label="Leave Event"
				>
					<svelte:fragment slot="icon">
						<ArrowLeftToBracketOutline />
					</svelte:fragment>
				</SidebarItem>
			{:else}
				<SidebarItem
					nonActiveClass="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white dark:hover:bg-primary-500"
					label="Join Event"
					on:click={() => rsvpModal = true}
				>
					<svelte:fragment slot="icon">
						<UserPlusSolid />
					</svelte:fragment>
				</SidebarItem>
			{/if}
		</SidebarGroup>
		<SidebarGroup border class="overflow-y-auto">
			<div class="flex items-center gap-2 dark:text-white px-2">
				<UsersSolid />
				<span class="self-center text-lg font-semibold whitespace-nowrap">
					{data.members.length} Event Member{data.members.length !== 1 ? "s" : ""}
				</span>
			</div>
			<SidebarGroup ulClass="space-y-0">
				{#each data.members as member}
					<EventMember {member} />
				{/each}
			</SidebarGroup>
			<SidebarGroup ulClass="space-y-0" border></SidebarGroup>
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
<Modal title="RSVP for {data.name}" placement="top-center" outsideclose bind:open={rsvpModal} bodyClass="overflow-y-visible">
	<div>
		<Label for="event-rsvp-role" class="mb-2">RSVP Role</Label>
		<BetterSelect
			id="event-rsvp-role"
			name="Event RSVP Role"
			options={data.roles.map((role) => ({
				value: role.id,
				name: role.name,
			}))}
			required
			bind:value={rsvpRole}
		/>
	</div>
	<svelte:fragment slot="footer">
		<Button disabled={!rsvpRole} on:click={() => {
			if (!rsvpRole) return;
			// rsvp
		}}>RSVP</Button>
		<Button color="alternative" on:click={() => rsvpModal = false}>Cancel</Button>
  	</svelte:fragment>
</Modal>