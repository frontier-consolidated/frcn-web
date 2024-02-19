<script lang="ts">
	import { goto } from "$app/navigation";
	import { hasAdmin } from "@frcn/shared";
	import { Button, Search, Table, TableHead, TableHeadCell } from "flowbite-svelte";
	import { CloseSolid, EditOutline } from "flowbite-svelte-icons";
    import Sortable from "sortablejs"
	import { queryParam } from "sveltekit-search-params";

	import SectionHeading from "$lib/components/SectionHeading.svelte";
	import { Mutations, getApollo } from "$lib/graphql";
	import type { GetCurrentUserQuery } from "$lib/graphql/__generated__/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";
	import { user } from "$lib/stores/UserStore";

    import type { PageData } from './$types';
	import RoleRow from "./RoleRow.svelte";


	const roleSearch = queryParam("q")
    
    export let data: PageData;
	$: editRoles = data.roles.toReversed()

	$: filteredRoles = $roleSearch ? editRoles.filter(r => r.name.toLowerCase().includes($roleSearch!.toLowerCase())) : editRoles;

	function getHighestMovableRole(roles: PageData["roles"], user: GetCurrentUserQuery["user"]) {
		if (!user) return roles.length;
		if (hasAdmin(user.permissions)) return -1;

		const userRoles = [user.primaryRole, ...user.roles]

		let highest = roles.length;
		for (const [i, role] of roles.entries()) {
			const userRole = userRoles.find(r => r.id === role.id)
			if (userRole && i < highest) {
				highest = i
			}
		}
		return highest
	}

	$: highestMoveable = getHighestMovableRole(filteredRoles, $user.data)

	let isDirty = false;
	$: isDirty = data.roles.toReversed().reduce((dirty, role, i) => dirty || editRoles[i].id !== role.id, false)

	let sortable: Sortable;
    function initSortable(el: HTMLElement) {
		sortable = new Sortable(el, {
			handle: ".move-handle",
			forceFallback: true,
			fallbackClass: "dragging",
			filter: ".cannot-reorder",
			onMove: function(ev) {
				if (ev.related.classList.contains("cannot-reorder")) {
					return false
				}
			},
			onEnd: function (ev) {
				const updatedRoles = [...editRoles]
				const movedRole = updatedRoles.splice(ev.oldIndex!, 1)[0]
				updatedRoles.splice(ev.newIndex!, 0, movedRole)
				editRoles = updatedRoles
			}
		})
    }

	async function save() {
		const { errors } = await getApollo().mutate({
			mutation: Mutations.REORDER_ROLES,
			variables: {
				order: editRoles.toReversed().map(r => r.id)
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

		data = {
			...data, 
			roles: editRoles.toReversed(),
		} as PageData;
	}
</script>

<svelte:head>
	<title>Admin - Edit Roles</title>
</svelte:head>

<SectionHeading>
    User Roles
</SectionHeading>
<div class="flex gap-2 px-2 my-4">
    <Search size="md" bind:value={$roleSearch} />
    <Button class="shrink-0" on:click={async () => {
		try {
			const { data: createData } = await getApollo().mutate({
				mutation: Mutations.CREATE_ROLE,
			});

			if (createData && createData.role) {
				await goto(`/admin/roles/${createData.role}`, {
					invalidateAll: true
				});
			}
		} catch (err) {
			pushNotification({
				type: "error",
				message: "Failed to create role"
			})
			console.error(err)
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
		<tbody class="divide-y" use:initSortable>
			{#each filteredRoles as role, i}
				{#key role.id}
					<RoleRow {role} locked={i <= highestMoveable} canMove={!$roleSearch} />
				{/key}
			{/each}
		</tbody>
	</Table>
	<div class="flex justify-end items-center gap-2">
		<Button color="alternative" on:click={() => {
			editRoles = data.roles.toReversed()
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