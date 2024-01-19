<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { Avatar, Dropdown, DropdownItem, DropdownDivider, Toggle } from "flowbite-svelte";

	const dispatch = createEventDispatcher();
</script>

<div class="flex items-center space-x-2 cursor-pointer">
	<span class="text-md font-semibold">SyntheticDev</span>
	<Avatar rounded size="sm" />
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
