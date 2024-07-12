<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { page } from "$app/stores";
	import { Permission, hasAdmin } from "@frcn/shared";
	import { Helper, Input, Label, TabItem, Tabs, Toggle } from "flowbite-svelte";
	import { ArrowLeftSolid, CloseSolid, EditOutline, ExclamationCircleSolid } from "flowbite-svelte-icons";

	import { Hr, SectionHeading, Select, Tooltip, Field, FieldValidator, Button, PermissionToggles, Head, ConfirmationModal } from "$lib/components";
	import { get_apollo, Mutations } from "$lib/graphql";
	import type { GetCurrentUserQuery } from "$lib/graphql/__generated__/graphql";
	import prevent_navigation from "$lib/preventNavigation";
	import { push_notification } from "$lib/stores/NotificationStore";
	import { roles_cache } from "$lib/stores/RolesCacheStore";
	import { user } from "$lib/stores/UserStore";

    import type { PageData } from "./$types";
	import UserButton from "./UserButton.svelte";

	function clone_role_data(data: PageData["role"]) {
		return {
			name: data.name,
			primary: data.primary,
			permissions: data.permissions,
			discordId: data.discordId
		};
	}

	function check_if_dirty(source: PageData["role"], mutable: ReturnType<typeof clone_role_data>) {
		let clean = true;
		const diff: string[] = [];
		for (const key of Object.keys(mutable) as (keyof typeof mutable)[]) {
			const value_clean = mutable[key] == source[key];
			if (!value_clean) diff.push(key);
			clean &&= value_clean;
		}
		// console.log(diff, mutable);
		return !clean;
	}

    export let data: PageData;
	let edit_data = clone_role_data(data.role);

	const { can_navigate, init_navigation } = prevent_navigation();

	let is_dirty = false;
	$: {
		is_dirty = check_if_dirty(data.role, edit_data);
		can_navigate.set(!is_dirty);
	}

	function check_if_can_toggle_admin(roles: typeof $roles_cache, role: PageData["role"], user: GetCurrentUserQuery["user"]) {
		if (!user) return false;
		if (!hasAdmin(user.permissions)) return false;
		if (role.default) return false;

		const user_roles = [user.primaryRole, ...user.roles];
		const admin_roles = roles.filter(r => !!user_roles.find(r2 => r2.id === r.id) && hasAdmin(r.permissions));
		if (admin_roles.length === 0) return true; // root admin user
		if (admin_roles.length > 1) return true; // user has multiple admin roles, let them toggle it
		return admin_roles[0].id != role.id;
	}

	$: canToggleAdmin = check_if_can_toggle_admin($roles_cache, data.role, $user.data);

	const validator = new FieldValidator();
	let make_default_primary_modal_open = false;

	async function save(confirm = false) {
		if (!validator.validate()) {
			push_notification({
				type: "error",
				message: "Check your inputs",
			});
			return;
		}

		// If setting this to a primary role will make it the default, display a confirmation
		if (!confirm && edit_data.primary && data.role.primary === false && $roles_cache.findIndex(r => r.id === data.role.id) < $roles_cache.findIndex(r => r.primary)) {
			make_default_primary_modal_open = true;
			return;
		}

		const { errors } = await get_apollo().mutate({
			mutation: Mutations.EDIT_ROLE,
			variables: {
				roleId: data.role.id,
				data: {
					name: edit_data.name,
					discordId: edit_data.discordId ? edit_data.discordId : null,
					permissions: edit_data.permissions,
					primary: edit_data.primary
				}
			},
			errorPolicy: "all",
		});

		if (errors && errors.length > 0) {
			push_notification({
				type: "error",
				message: "Failed to save",
			});
			console.error(errors);
			return;
		}

		await invalidate("app:currentrole");
	}
</script>

<Head
	title="{data.role?.name} Role - Admin"
/>

<a class="flex items-center text-gray-300 mb-2 p-2 cursor-pointer hover:text-gray-400" href="/admin/roles" use:init_navigation>
	<ArrowLeftSolid class="me-2" tabindex="-1" /> Back to Roles
</a>
<SectionHeading>
    Edit Role - {data.role?.name}
</SectionHeading>
<div class="flex-1 flex flex-col justify-between">
	<div>
		<Tabs style="underline" class="mt-2" contentClass="">
			<TabItem title="General" open={$page.url.hash === "#general" || !$page.url.hash} on:click={() => window.location.hash = "#general"}>
				<div class="flex flex-col gap-4 p-4">
					<Field {validator} for="system-roles-role-name" value={edit_data.name} required>
						<Label for="system-roles-role-name" class="mb-2">Role Name</Label>
						<Input
							class="rounded"
							id="system-roles-role-name"
							name="system-roles-role-name"
							type="text"
							placeholder="Role name"
							pattern="[A-Za-z]"
							required
							bind:value={edit_data.name}
						/>
					</Field>
					<Hr />
					<Field {validator} for="system-roles-role-primary" value={edit_data.primary} required>
						<Toggle id="system-roles-role-primary" bind:checked={edit_data.primary}>
							Primary Role
						</Toggle>
						<Helper class="mt-1">
							Sets the role as a primary role, users must only have 1 primary role
						</Helper>
					</Field>
					<Hr />
					<Field {validator} for="system-roles-role-discord-role" value={edit_data.discordId}>
						<Label for="system-roles-role-discord-role" class="mb-2 flex items-center">
							Discord Role
							{#if data.role.discordId && !data.options.discordRoles.find(r => r.id === data.role.discordId)}
								<Tooltip>
									<ExclamationCircleSolid slot="icon" class="ms-2 text-orange-400" />
									The previously linked discord role no longer exists
								</Tooltip>
							{/if}
						</Label>
						<Select
							id="system-roles-role-discord-role"
							name="system-roles-role-discord-role"
							options={[{
								value: "",
								name: "None",
							}, ...data.options.discordRoles.map(role => ({
								value: role.id,
								name: role.name,
								style: {
									color: role.color === "#000000" ? "#e5e7eb" : role.color
								}
							}))]}
							search
							bind:value={edit_data.discordId}
							let:option
						>
							<div class="flex items-center">
								{#if option.style?.color}
									<div class="rounded-full w-3 h-3 me-2" style="background-color:{option.style?.color}" />
								{/if}
								<span>{option.name}</span>
							</div>
						</Select>
						<Helper class="mt-1">
							The discord guild role that this role is linked to, users will receive this role if they have the selected discord role
						</Helper>
					</Field>
				</div>
			</TabItem>
			<TabItem title="Permissions" open={$page.url.hash === "#permissions"} on:click={() => window.location.hash = "#permissions"}>
				<PermissionToggles disableToggles={{ [Permission.Admin]: !canToggleAdmin }} bind:permissions={edit_data.permissions} let:info let:checked>
					{#if info.permission === Permission.Admin && !canToggleAdmin}
						{#if data.role.default}
							<Tooltip>
								<ExclamationCircleSolid slot="icon" class="ms-2 text-orange-400" />
								You cannot give admin permissions to the default primary role
							</Tooltip>
						{:else if checked}
							<Tooltip>
								<ExclamationCircleSolid slot="icon" class="ms-2 text-orange-400" />
								You cannot remove admin from this role as this is the only role that gives you admin
							</Tooltip>
						{/if}
					{/if}
				</PermissionToggles>
			</TabItem>
			<TabItem title="Users ({data.role.users.length})" open={$page.url.hash === "#users"} on:click={() => window.location.hash = "#users"}>
				<div class="flex flex-col gap-1 p-4 max-h-screen overflow-y-auto">
					{#each data.role.users as user}
						<UserButton role={data.role} {user} />
					{/each}
				</div>
			</TabItem>
		</Tabs>
	</div>
	<div class="flex justify-end items-center gap-2">
		<Button color="alternative" on:click={() => {
			edit_data = clone_role_data(data.role);
		}}>
			<CloseSolid class="me-2" tabindex="-1" /> Cancel
		</Button>
		<Button
			disabled={!is_dirty}
			on:click={() => {
				if (!is_dirty) return;
				save().catch(console.error);
			}}
		>
			<EditOutline class="me-2" tabindex="-1" /> Save
		</Button>
	</div>
</div>

<ConfirmationModal title="Make default primary role" bind:open={make_default_primary_modal_open} on:confirm={async () => {
	save(true).then(() => (make_default_primary_modal_open = false)).catch(console.error);
}}>
    <span>WARNING! Making this a primary role will make it the default primary role. Place this role above the default before making it primary to prevent this.</span>
</ConfirmationModal>
