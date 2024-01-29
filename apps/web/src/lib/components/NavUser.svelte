<script lang="ts">
	import { hasOneOfPermissions } from "@frcn/shared";
	import { Avatar, Dropdown, DropdownItem, DropdownDivider } from "flowbite-svelte";
	import { createEventDispatcher } from "svelte";

	import adminPermissions from "$lib/data/adminPermissions";
	import { user } from "$lib/stores/UserStore";

	const dispatch = createEventDispatcher();
</script>

<div class="flex items-center space-x-2 cursor-pointer">
	<span class="text-md font-semibold">{$user.data?.name}</span>
	<Avatar rounded size="sm" src={$user.data?.avatarUrl} />
</div>
<Dropdown class="w-44">
	<DropdownItem>My Profile</DropdownItem>
	<DropdownItem>Settings</DropdownItem>
	{#if $user.data && hasOneOfPermissions($user.data?.permissions, adminPermissions)}
		<DropdownDivider />
		<DropdownItem href="/admin/general">System Settings</DropdownItem>
	{/if}
	<DropdownItem
		slot="footer"
		on:click={() => {
			dispatch("logout");
		}}>Logout</DropdownItem
	>
</Dropdown>
