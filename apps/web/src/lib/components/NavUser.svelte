<script lang="ts">
	import { Avatar, Dropdown, DropdownItem, DropdownDivider, Toggle } from "flowbite-svelte";
	import { createEventDispatcher } from "svelte";

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
	<DropdownDivider />
	<li>
		<Toggle class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">Streamer Mode</Toggle>
	</li>
	<DropdownItem
		slot="footer"
		on:click={() => {
			dispatch("logout");
		}}>Logout</DropdownItem
	>
</Dropdown>
