<script lang="ts">
	import { hasOneOfPermissions } from "@frcn/shared";
	import { Avatar, Dropdown, DropdownItem, DropdownDivider } from "flowbite-svelte";
	import { createEventDispatcher } from "svelte";

	import adminPermissions from "$lib/data/adminPermissions";
	import { user } from "$lib/stores/UserStore";

	import MediaQuery from "./MediaQuery.svelte";

	const dispatch = createEventDispatcher();
</script>

<div class="flex items-center space-x-2 cursor-pointer">
	<MediaQuery query="(min-width: 480px)" let:matches>
		{#if matches}
			<span class="text-md font-semibold">{$user.data?.name}</span>
		{/if}
	</MediaQuery>
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
