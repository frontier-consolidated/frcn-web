<script lang="ts">
	import { Permission, hasAllOfPermissions, hasOneOfPermissions } from "@frcn/shared";
	import { Avatar, Dropdown, DropdownItem, DropdownDivider } from "flowbite-svelte";
	import { createEventDispatcher } from "svelte";

	import adminPermissions from "$lib/data/adminPermissions";
	import { viewUserProfile } from "$lib/stores/UserProfileViewStore";
	import { user } from "$lib/stores/UserStore";

	import MediaQuery from "./utils/MediaQuery.svelte";

	const dispatch = createEventDispatcher();

	$: showSystemSettings = $user.data && hasOneOfPermissions($user.data.permissions, adminPermissions);
	$: showCms = $user.data && hasAllOfPermissions($user.data.permissions, [Permission.CmsRead, Permission.CmsWrite]);
</script>

<div class="shrink-0 flex items-center space-x-2 cursor-pointer">
	<MediaQuery query="(min-width: 480px)" let:matches>
		{#if matches}
			<span class="text-md font-semibold">{$user.data?.name}</span>
		{/if}
	</MediaQuery>
	<Avatar rounded size="sm" src={$user.data?.avatarUrl} />
</div>
<Dropdown containerClass="rounded divide-y z-50" class="w-44">
	<DropdownItem on:click={() => {
		if ($user.data) viewUserProfile($user.data);
	}}>My Profile</DropdownItem>
	<DropdownItem href="/account">Settings</DropdownItem>
	{#if showSystemSettings || showCms}
		<DropdownDivider />
	{/if}
	{#if showSystemSettings}
		<DropdownItem href="/admin/general">System Settings</DropdownItem>
	{/if}
	{#if showCms}
		<DropdownItem href="/cms">Manage Content</DropdownItem>
	{/if}
	<DropdownItem
		slot="footer"
		on:click={() => {
			dispatch("logout");
		}}>Logout</DropdownItem
	>
</Dropdown>
