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
		UsersSolid,
	} from "flowbite-svelte-icons";
	import EventMember from "./EventMember.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<Sidebar asideClass="w-64 max-h-screen">
	<SidebarWrapper>
		<SidebarGroup>
			<SidebarItem href="/events" label="Back To Events">
				<svelte:fragment slot="icon">
					<ArrowLeftSolid />
				</svelte:fragment>
			</SidebarItem>
			<SidebarDropdownWrapper label="Manage">
				<svelte:fragment slot="icon">
					<AdjustmentsHorizontalSolid />
				</svelte:fragment>
				<SidebarDropdownItem label="Invite Members" />
				<SidebarDropdownItem label="End Event" class="dark:hover:bg-red-500" />
			</SidebarDropdownWrapper>
			<SidebarItem
				nonActiveClass="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white dark:hover:bg-red-500"
				label="Leave Event"
			>
				<svelte:fragment slot="icon">
					<ArrowLeftToBracketOutline />
				</svelte:fragment>
			</SidebarItem>
		</SidebarGroup>
		<SidebarGroup border class="overflow-y-auto">
			<div class="flex items-center gap-2 dark:text-white px-2">
				<UsersSolid />
				<span class="self-center text-lg font-semibold whitespace-nowrap">
					{data.members.length} Event Member{data.members.length > 1 ? "s" : ""}
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
