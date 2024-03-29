<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { page } from "$app/stores";
	import { Permission, hasAdmin } from "@frcn/shared"
	import { Avatar, Button, Helper, Input, Label, TabItem, Tabs, Toggle } from "flowbite-svelte";
	import { ArrowLeftSolid, CloseCircleSolid, CloseSolid, EditOutline, ExclamationCircleSolid } from "flowbite-svelte-icons";

	import Hr from "$lib/components/Hr.svelte";
	import SectionHeading from "$lib/components/SectionHeading.svelte";
	import BetterSelect from "$lib/components/select/BetterSelect.svelte";
	import Tooltip from "$lib/components/Tooltip.svelte";
	import Field from "$lib/components/validation/Field.svelte";
	import { FieldValidator } from "$lib/components/validation/FieldValidator";
	import { getApollo, Mutations } from "$lib/graphql";
	import type { GetCurrentUserQuery } from "$lib/graphql/__generated__/graphql";
	import preventNavigation from "$lib/preventNavigation";
	import { pushNotification } from "$lib/stores/NotificationStore";
	import { user } from "$lib/stores/UserStore";

    import type { PageData } from './$types';
	import { permissionDefs } from "./permissionDefs";

	function cloneRoleData(data: PageData["role"]) {
		return {
			name: data.name,
			primary: data.primary,
			permissions: data.permissions,
			discordId: data.discordId
		}
	}

	function checkIfDirty(source: PageData["role"], mutable: ReturnType<typeof cloneRoleData>) {
		let clean = true;
		const diff: string[] = [];
		for (const key of Object.keys(mutable) as (keyof typeof mutable)[]) {
			const valueClean = mutable[key] == source[key];
			if (!valueClean) diff.push(key);
			clean &&= valueClean;
		}
		// console.log(diff, mutable);
		return !clean;
	}

    export let data: PageData;
	let editData = cloneRoleData(data.role);

	const { canNavigate, initNavigation } = preventNavigation()

	let isDirty = false;
	$: {
		isDirty = checkIfDirty(data.role, editData)
		canNavigate.set(!isDirty)
	}

	function checkIfCanToggleAdmin(roles: PageData["roles"], role: PageData["role"], user: GetCurrentUserQuery["user"]) {
		if (!user) return false;
		if (!hasAdmin(user.permissions)) return false;

		const userRoles = [user.primaryRole, ...user.roles]
		const adminRoles = roles.filter(r => !!userRoles.find(r2 => r2.id === r.id) && hasAdmin(r.permissions))
		if (adminRoles.length === 0) return false; // somehow?
		if (adminRoles.length > 1) return true;
		return adminRoles[0].id != role.id
	}

	$: canToggleAdmin = checkIfCanToggleAdmin(data.roles, data.role, $user.data)

	function togglePermission(ev: Event, permission: Permission) {
		const target = (ev.target) as HTMLInputElement
		if (target.checked) {
			editData.permissions |= permission
		} else {
			editData.permissions ^= permission
		}
	}

	let validator = new FieldValidator();

	async function save() {
		const { data: updatedData, errors } = await getApollo().mutate({
			mutation: Mutations.EDIT_ROLE,
			variables: {
				roleId: data.role.id,
				data: {
					name: editData.name,
					discordId: editData.discordId ? editData.discordId : null,
					permissions: editData.permissions,
					primary: editData.primary
				}
			},
			errorPolicy: "all",
		});

		if (errors && errors.length > 0) {
			pushNotification({
				type: "error",
				message: "Failed to save",
			});
			console.error(errors);
			return;
		}

		await invalidateAll()
		data = {
			...data, 
			role: {
				...data.role,
				...updatedData?.role
			},
		} as PageData;
		editData = cloneRoleData(data.role);
	}
</script>

<svelte:head>
	<title>{data.role?.name} - Admin | Frontier Consolidated</title>
</svelte:head>

<a class="flex items-center text-gray-300 mb-2 p-2 cursor-pointer hover:text-gray-400" href="/admin/roles" use:initNavigation>
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
					<Field {validator} for="system-roles-role-name" value={editData.name} required>
						<Label for="system-roles-role-name" class="mb-2">Role Name</Label>
						<Input
							id="system-roles-role-name"
							name="Role Name"
							type="text"
							placeholder="Role name"
							pattern="[A-Za-z]"
							required
							bind:value={editData.name}
						/>
					</Field>
					<Hr />
					<Field {validator} for="system-roles-role-primary" value={editData.primary} required>
						<Toggle id="system-roles-role-primary" bind:checked={editData.primary}>
							Primary Role
						</Toggle>
						<Helper class="mt-1">
							Sets the role as a primary role, users must only have 1 primary role
						</Helper>
					</Field>
					<Hr />
					<Field {validator} for="system-roles-role-discord-role" value={editData.discordId}>
						<Label for="system-roles-role-discord-role" class="mb-2 flex items-center">
							Discord Role
							{#if data.role.discordId && !data.options.discordRoles.find(r => r.id === data.role.discordId)}
								<Tooltip>
									<ExclamationCircleSolid slot="icon" class="ms-2 text-orange-400" />
									The previously linked discord role no longer exists
								</Tooltip>
							{/if}
						</Label>
						<BetterSelect
							id="system-roles-role-discord-role"
							name="Role Discord Role"
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
							bind:value={editData.discordId}
							let:option
						>
							<div class="flex items-center">
								{#if option.style?.color}
									<div class="rounded-full w-3 h-3 me-2" style="background-color:{option.style?.color}" />
								{/if}
								<span>{option.name}</span>
							</div>
						</BetterSelect>
						<Helper class="mt-1">
							The discord guild role that this role is linked to, users will receive this role if they have the selected discord role
						</Helper>
					</Field>
				</div>
			</TabItem>
			<TabItem title="Permissions" open={$page.url.hash === "#permissions"} on:click={() => window.location.hash = "#permissions"}>
				<div class="flex flex-col gap-4 p-4 mt-2">
					{#each permissionDefs as info, i}
						{@const disabled = info.permission === Permission.Admin && !canToggleAdmin}
						<div>
							<Toggle
								{disabled}
								checked={(editData.permissions & info.permission) > 0} 
								on:change={(ev) => togglePermission(ev, info.permission)}
							>
								{info.name}
								{#if disabled}
									<Tooltip>
										<ExclamationCircleSolid slot="icon" class="ms-2 text-orange-400" />
										You cannot remove admin from this role as this is the only role that gives you admin
									</Tooltip>
								{/if}
							</Toggle>
							<Helper class="mt-1">
								{info.help}
							</Helper>
						</div>
						{#if i + 1 < Object.values(permissionDefs).length}
							<Hr />
						{/if}
					{/each}
				</div>
			</TabItem>
			<TabItem title="Users ({data.role.users.length})" open={$page.url.hash === "#users"} on:click={() => window.location.hash = "#users"}>
				<div class="flex flex-col gap-1 p-4 max-h-screen overflow-y-auto">
					{#each data.role.users as user}
						<div class="flex justify-between items-center p-2 pe-4 rounded cursor-pointer dark:hover:bg-gray-800">
							<div class="flex items-center gap-2">
								<Avatar rounded size="sm" src={user.avatarUrl} />
								<span class="text-md font-semibold dark:text-white">{user.name}</span>
							</div>
							<Tooltip>
								<CloseCircleSolid slot="icon" class="remove-user dark:text-gray-400 dark:hover:text-white" />
								Remove User
							</Tooltip>
						</div>
					{/each}
				</div>
			</TabItem>
		</Tabs>
	</div>
	<div class="flex justify-end items-center gap-2">
		<Button color="alternative" on:click={() => {
			editData = cloneRoleData(data.role);
		}}>
			<CloseSolid class="me-2" tabindex="-1" /> Cancel
		</Button>
		<Button
			disabled={!isDirty}
			on:click={() => {
				if (!isDirty) return;
				save();
			}}
		>
			<EditOutline class="me-2" tabindex="-1" /> Save
		</Button>
	</div>
</div>