<script lang="ts">
	import { goto } from "$app/navigation";
	import { hasAdmin } from "@frcn/shared";
	import { Search, Table, TableHead, TableHeadCell } from "flowbite-svelte";
	import { CloseSolid, EditOutline } from "flowbite-svelte-icons";
    import Sortable from "sortablejs";
	import { queryParam } from "sveltekit-search-params";

	import { Button, Head, SectionHeading } from "$lib/components";
	import { Mutations, get_apollo } from "$lib/graphql";
	import type { GetCurrentUserQuery } from "$lib/graphql/__generated__/graphql";
	import prevent_navigation from "$lib/preventNavigation";
	import { push_notification } from "$lib/stores/NotificationStore";
	import { roles_cache } from "$lib/stores/RolesCacheStore";
	import { user } from "$lib/stores/UserStore";

	import RoleRow from "./RoleRow.svelte";

	const role_search = queryParam("q");
    
	$: editRoles = $roles_cache.toReversed();

	$: filteredRoles = $role_search ? editRoles.filter(r => r.name.toLowerCase().includes($role_search!.toLowerCase())) : editRoles;

	function get_highest_movable_role(roles: typeof $roles_cache, user: GetCurrentUserQuery["user"]) {
		if (!user) return roles.length;
		if (hasAdmin(user.permissions)) return -1;

		const user_roles = [user.primaryRole, ...user.roles];

		let highest = roles.length;
		for (const [i, role] of roles.entries()) {
			const user_role = user_roles.find(r => r.id === role.id);
			if (user_role && i < highest) {
				highest = i;
			}
		}
		return highest;
	}

	$: highestMoveable = get_highest_movable_role(filteredRoles, $user.data);

	const { can_navigate, init_navigation } = prevent_navigation();

	let is_dirty = false;
	$: {
		is_dirty = $roles_cache.toReversed().reduce((dirty, role, i) => dirty || editRoles[i].id !== role.id, false);
		can_navigate.set(!is_dirty);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let sortable: Sortable;
    function init_sortable(el: HTMLElement) {
		sortable = new Sortable(el, {
			handle: ".move-handle",
			forceFallback: true,
			fallbackClass: "dragging",
			filter: ".cannot-reorder",
			onMove: function(ev) {
				if (ev.related.classList.contains("cannot-reorder")) {
					return false;
				}
			},
			onEnd: function (ev) {
				const updated_roles = [...editRoles];
				const moved_role = updated_roles.splice(ev.oldIndex!, 1)[0];
				updated_roles.splice(ev.newIndex!, 0, moved_role);
				editRoles = updated_roles;
			}
		});
    }

	async function save() {
		const { errors } = await get_apollo().mutate({
			mutation: Mutations.REORDER_ROLES,
			variables: {
				order: editRoles.toReversed().map(r => r.id)
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

		editRoles = $roles_cache.toReversed();
	}
</script>

<Head
	title="Roles - Admin"
/>

<SectionHeading>
    User Roles
</SectionHeading>
<div class="flex gap-2 px-2 my-4" use:init_navigation>
    <Search size="md" bind:value={$role_search} class="rounded" />
    <Button class="shrink-0" on:click={async () => {
		try {
			const { data: create_data } = await get_apollo().mutate({
				mutation: Mutations.CREATE_ROLE,
			});

			if (create_data && create_data.role) {
				await goto(`/admin/roles/${create_data.role}`);
			}
		} catch (err) {
			push_notification({
				type: "error",
				message: "Failed to create role"
			});
			console.error(err);
		}
	}}>
        Create Role
    </Button>
</div>
<div class="flex-1 flex flex-col justify-between">
	<Table divClass="relative">
		<TableHead>
			<TableHeadCell class="w-8 px-0"></TableHeadCell>
			<TableHeadCell class="pl-2">
				Roles - {editRoles.length}
			</TableHeadCell>
			<TableHeadCell class="w-32 text-center">
				Members
			</TableHeadCell>
			<TableHeadCell class="w-32"></TableHeadCell>
		</TableHead>
		<tbody class="divide-y" use:init_sortable>
			{#each filteredRoles as role, i}
				{#key role.id}
					<RoleRow {role} locked={i <= highestMoveable} canMove={!$role_search} />
				{/key}
			{/each}
		</tbody>
	</Table>
	<div class="flex justify-end items-center gap-2">
		<Button color="alternative" on:click={() => {
			editRoles = $roles_cache.toReversed();
		}}>
			<CloseSolid class="me-2" tabindex="-1" /> Cancel
		</Button>
		<Button
			disabled={!is_dirty}
			on:click={() => {
				if (!is_dirty) return;
				save();
			}}
		>
			<EditOutline class="me-2" tabindex="-1" /> Save
		</Button>
	</div>
</div>