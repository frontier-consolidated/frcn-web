<script lang="ts">
	import { Avatar, Dropdown, DropdownDivider, DropdownItem } from "flowbite-svelte";
	import { DotsVerticalOutline, UserRemoveSolid, UserGroupSolid } from "flowbite-svelte-icons";

	import type { PageData } from "./$types";

	export let member: PageData["members"][number];
</script>

<div class="flex items-center gap-2 p-1 dark:text-white cursor-pointer">
	<Avatar rounded size="sm" />
	<div class="flex-1 flex flex-col">
		<span class="text-md font-semibold">{member.user.name}</span>
		<span class="text-sm font-semibold text-gray-400">Event Member</span>
	</div>
	<DotsVerticalOutline
		id="dots-menu-{member.user.id}"
		class="dots-menu ml-auto dark:hover:text-gray-500"
		size="sm"
	/>
</div>
<Dropdown triggeredBy="#dots-menu-{member.user.id}">
	<DropdownItem>User Details</DropdownItem>
	<DropdownDivider />
	<DropdownItem class="flex">
		<UserGroupSolid class="me-2" /> Join {member.user.name}'s crew
	</DropdownItem>
	<DropdownItem class="flex">
		<UserGroupSolid class="me-2" /> Add to my crew
	</DropdownItem>
	<DropdownItem class="flex dark:hover:bg-red-500">
		<UserRemoveSolid class="me-2" /> Kick Member
	</DropdownItem>
</Dropdown>
