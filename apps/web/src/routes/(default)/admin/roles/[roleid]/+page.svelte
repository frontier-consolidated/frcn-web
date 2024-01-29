<script lang="ts">
	import { Permission } from "@frcn/shared"
	import { Helper, Input, Label, TabItem, Tabs, Toggle } from "flowbite-svelte";
	import { ArrowLeftSolid } from "flowbite-svelte-icons";

	import Hr from "$lib/components/Hr.svelte";
	import SectionHeading from "$lib/components/SectionHeading.svelte";
	import BetterSelect from "$lib/components/select/BetterSelect.svelte";

	const permissions = {
		[Permission.Admin]: {
			name: "Administrator",
			help: "Users with this permission will have every permission"
		},
		[Permission.CreateEvents]: {
			name: "Create Events",
			help: "Allows users to create, edit, post and delete events"
		},
		[Permission.ManageRoles]: {
			name: "Manage Roles",
			help: "Allows users to modify the roles of other users, create new roles and modify and reorder roles"
		},
		[Permission.ManageSystem]: {
			name: "Manage System",
			help: "Allows users to modify general system settings and event channels"
		},
	} satisfies Record<Permission, { name: string, help: string }>

    // import type { PageData } from './$types';
    
    // export let data: PageData;
</script>

<svelte:head>
	<title>Admin - Edit Role - ROLE NAME</title>
</svelte:head>

<a class="flex items-center text-gray-300 mb-2 p-2 cursor-pointer hover:text-gray-400" href="/admin/roles">
	<ArrowLeftSolid class="me-2" /> Back to Roles
</a>
<SectionHeading>
    Edit Role - ROLE NAME
</SectionHeading>
<Tabs style="underline" class="mt-2" contentClass="">
	<TabItem title="General" open>
		<div class="flex flex-col gap-4 p-4">
			<div>
				<Label for="system-roles-role-name" class="mb-2">Role Name</Label>
				<Input
					id="system-roles-role-name"
					name="Role Name"
					type="text"
					placeholder="Role name"
					pattern="[A-Za-z]"
					required
				/>
			</div>
			<Hr />
			<div>
				<Toggle>
					Primary Role
				</Toggle>
				<Helper class="mt-1">
					Sets the role as a primary role, users must only have 1 primary role
				</Helper>
			</div>
			<Hr />
			<div>
				<Label for="system-roles-role-discord-role" class="mb-2">Discord Role</Label>
				<BetterSelect
					id="system-roles-role-discord-role"
					name="Role Discord Role"
					required
				/>
				<Helper class="mt-1">
					The discord guild role that this role is linked to
				</Helper>
			</div>
		</div>
	</TabItem>
	<TabItem title="Permissions">
		<div class="flex flex-col gap-4 p-4 mt-2">
			{#each Object.entries(permissions) as [permission, info], i}
				<div>
					<Toggle>
						{info.name}
					</Toggle>
					<Helper class="mt-1">
						{info.help}
					</Helper>
				</div>
				{#if i + 1 < Object.values(permissions).length}
					<Hr />
				{/if}
			{/each}
		</div>
	</TabItem>
	<TabItem title="Members">
		<div class="flex flex-col gap-4 p-4">
			
		</div>
	</TabItem>
</Tabs>