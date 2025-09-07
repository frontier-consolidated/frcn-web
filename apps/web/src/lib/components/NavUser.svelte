<script lang="ts">
	import { Permission, hasAdmin, hasAllOfPermissions, hasOneOfPermissions } from "@frcn/shared";
	import { Avatar, Dropdown, DropdownItem, DropdownDivider, Toggle } from "flowbite-svelte";
	import { createEventDispatcher } from "svelte";

	import adminPermissions from "$lib/data/adminPermissions";
	import { viewUserProfile } from "$lib/stores/UserProfileViewStore";
	import { toggleAdminMode, user } from "$lib/stores/UserStore";

	import MediaQuery from "./utils/MediaQuery.svelte";

	const dispatch = createEventDispatcher();

	$: showSystemSettings =
		$user.data && hasOneOfPermissions($user.data.permissions, adminPermissions);
	$: showCms =
		$user.data &&
		hasAllOfPermissions($user.data.permissions, [Permission.CmsRead, Permission.CmsWrite]);

	let adminMode = $user.adminMode;
</script>

<div class="flex shrink-0 cursor-pointer items-center space-x-2">
	<MediaQuery query="(min-width: 480px)" let:matches>
		{#if matches}
			<span class="text-md font-semibold">{$user.data?.name}</span>
		{/if}
	</MediaQuery>
	<Avatar rounded size="sm" src={$user.data?.avatarUrl} />
</div>
<Dropdown containerClass="rounded divide-y z-50" class="w-44">
	<DropdownItem
		on:click={() => {
			if ($user.data) viewUserProfile($user.data);
		}}>My Profile</DropdownItem
	>
	<DropdownItem href="/account">Settings</DropdownItem>
	{#if hasAdmin($user.data?.__permissions ?? 0)}
		<li>
			<Toggle
				size="small"
				class="flex-row-reverse px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600"
				classDiv="me-0 ms-3"
				bind:checked={adminMode}
				on:change={() => {
					toggleAdminMode(adminMode);
				}}
			>
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
