<script lang="ts">
	import { hasAdmin } from "@frcn/shared";
	import { Search, Table, TableHead, TableHeadCell } from "flowbite-svelte";
	import { CloseSolid, EditOutline } from "flowbite-svelte-icons";
	import Sortable from "sortablejs";
	import { queryParam } from "sveltekit-search-params";

	import { goto } from "$app/navigation";
	import { Button, Head, SectionHeading } from "$lib/components";
	import { Mutations, getApollo } from "$lib/graphql";
	import type { GetCurrentUserQuery } from "$lib/graphql/__generated__/graphql";
	import preventNavigation from "$lib/preventNavigation";
	import { pushNotification } from "$lib/stores/NotificationStore";
	import { rolesCache } from "$lib/stores/RolesCacheStore";
	import { user } from "$lib/stores/UserStore";

	import RoleRow from "./RoleRow.svelte";

	const roleSearch = queryParam("q");

	$: editRoles = $rolesCache.toReversed();

	$: filteredRoles = $roleSearch
		? editRoles.filter((r) => r.name.toLowerCase().includes($roleSearch!.toLowerCase()))
		: editRoles;

	function getHighestMovableRole(roles: typeof $rolesCache, user: GetCurrentUserQuery["user"]) {
		if (!user) return roles.length;
		if (hasAdmin(user.permissions)) return -1;

		const userRoles = [user.primaryRole, ...user.roles];

		let highest = roles.length;
		for (const [i, role] of roles.entries()) {
			const userRole = userRoles.find((r) => r.id === role.id);
			if (userRole && i < highest) {
				highest = i;
			}
		}
		return highest;
	}

	$: highestMoveable = getHighestMovableRole(filteredRoles, $user.data);

	const { canNavigate, initNavigation } = preventNavigation();

	let isDirty = false;
	$: {
		isDirty = $rolesCache
			.toReversed()
			.reduce((dirty, role, i) => dirty || editRoles[i].id !== role.id, false);
		canNavigate.set(!isDirty);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let sortable: Sortable;
	function initSortable(el: HTMLElement) {
		sortable = new Sortable(el, {
			handle: ".move-handle",
			forceFallback: true,
			fallbackClass: "dragging",
			filter: ".cannot-reorder",
			onMove: function (ev) {
				if (ev.related.classList.contains("cannot-reorder")) {
					return false;
				}
			},
			onEnd: function (ev) {
				const updatedRoles = [...editRoles];
				const movedRole = updatedRoles.splice(ev.oldIndex!, 1)[0];
				updatedRoles.splice(ev.newIndex!, 0, movedRole);
				editRoles = updatedRoles;
			}
		});
	}

	async function save() {
		const { errors } = await getApollo().mutate({
			mutation: Mutations.REORDER_ROLES,
			variables: {
				order: editRoles.toReversed().map((r) => r.id)
			},
			errorPolicy: "all"
		});

		if (errors && errors.length > 0) {
			pushNotification({
				type: "error",
				message: "Failed to save"
			});
			console.error(errors);
			return;
		}

		editRoles = $rolesCache.toReversed();
	}
</script>

<Head title="Roles - Admin" />

<SectionHeading>User Roles</SectionHeading>
<div class="my-4 flex gap-2 px-2" use:initNavigation>
	<Search size="md" bind:value={$roleSearch} class="rounded" />
	<Button
		class="shrink-0"
		on:click={async () => {
			try {
				const { data: createData } = await getApollo().mutate({
					mutation: Mutations.CREATE_ROLE
				});

				if (createData && createData.role) {
					await goto(`/admin/roles/${createData.role}`);
				}
			} catch (err) {
				pushNotification({
					type: "error",
					message: "Failed to create role"
				});
				console.error(err);
			}
		}}
	>
		Create Role
	</Button>
</div>
<div class="flex flex-1 flex-col justify-between">
	<Table divClass="relative">
		<TableHead>
			<TableHeadCell class="w-8 px-0"></TableHeadCell>
			<TableHeadCell class="pl-2">
				Roles - {editRoles.length}
			</TableHeadCell>
			<TableHeadCell class="w-32 text-center">Members</TableHeadCell>
			<TableHeadCell class="w-32"></TableHeadCell>
		</TableHead>
		<tbody class="divide-y" use:initSortable>
			{#each filteredRoles as role, i}
				{#key role.id}
					<RoleRow {role} locked={i <= highestMoveable} canMove={!$roleSearch} />
				{/key}
			{/each}
		</tbody>
	</Table>
	<div class="flex items-center justify-end gap-2">
		<Button
			color="alternative"
			on:click={() => {
				editRoles = $rolesCache.toReversed();
			}}
		>
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
