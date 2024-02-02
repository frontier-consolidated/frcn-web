<script lang="ts">
	import { Button, Search, Table, TableHead, TableHeadCell } from "flowbite-svelte";
    import Sortable from "sortablejs"

	import SectionHeading from "$lib/components/SectionHeading.svelte";

	import RoleRow from "./RoleRow.svelte";

    // import type { PageData } from './$types';
    
    // export let data: PageData;

	let sortable: Sortable;
    function initSortable(el: HTMLElement) {
		sortable = new Sortable(el, {
			handle: ".move-handle",
			forceFallback: true,
			fallbackClass: "dragging"
		})
    }
</script>

<svelte:head>
	<title>Admin - Edit Roles</title>
</svelte:head>

<SectionHeading>
    User Roles
</SectionHeading>
<div class="flex gap-2 px-2 my-4">
    <Search size="md" />
    <Button class="shrink-0">
        Create Role
    </Button>
</div>
<Table divClass="relative">
	<TableHead>
		<TableHeadCell class="w-8 px-0"></TableHeadCell>
		<TableHeadCell class="pl-2">
			Roles - 1
		</TableHeadCell>
		<TableHeadCell class="w-32 text-center">
			Members
		</TableHeadCell>
		<TableHeadCell class="w-32"></TableHeadCell>
	</TableHead>
	<tbody class="divide-y" use:initSortable>
		<RoleRow name="Role 1" />
        <RoleRow name="Role 2" />
        <RoleRow name="Role 3" />
        <RoleRow name="Role 4" />
	</tbody>
</Table>