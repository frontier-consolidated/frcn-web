<script lang="ts">
	import { Permission, hasAdmin, hasAllOfPermissions, hasOneOfPermissions } from "@frcn/shared";
	import { Avatar, Dropdown, DropdownItem, DropdownDivider, Toggle } from "flowbite-svelte";
	import { createEventDispatcher } from "svelte";

	import admin_permissions from "$lib/data/adminPermissions";
	import { view_user_profile } from "$lib/stores/UserProfileViewStore";
	import { toggle_admin_mode, user } from "$lib/stores/UserStore";

	import MediaQuery from "./utils/MediaQuery.svelte";

	const dispatch = createEventDispatcher();

	$: showSystemSettings = $user.data && hasOneOfPermissions($user.data.permissions, admin_permissions);
	$: showCms = $user.data && hasAllOfPermissions($user.data.permissions, [Permission.CmsRead, Permission.CmsWrite]);

	let admin_mode = $user.adminMode;
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
		if ($user.data) view_user_profile($user.data);
	}}>My Profile</DropdownItem>
	<DropdownItem href="/account">Settings</DropdownItem>
	{#if hasAdmin($user.data?.__permissions ?? 0)}
		<li>
			<Toggle size="small" class="flex-row-reverse py-2 px-4 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-600" classDiv="me-0 ms-3" bind:checked={admin_mode} on:change={() => {
				toggle_admin_mode(admin_mode);
			}}>
				<span class="mr-auto">Admin Mode</span>
			</Toggle>
		</li>
	{/if}
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
