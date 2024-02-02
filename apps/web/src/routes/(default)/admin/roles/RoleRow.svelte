<script lang="ts">
	import { goto } from "$app/navigation";
	import { TableBodyCell, TableBodyRow } from "flowbite-svelte";
	import { DotsVerticalOutline, PenSolid, TrashBinSolid, UsersSolid } from "flowbite-svelte-icons";
	import { twMerge } from "tailwind-merge";

    export let name: string = "Admin"
    let clazz: string = ""
    export { clazz as class }
</script>

<TableBodyRow class={twMerge("group cursor-pointer dark:hover:bg-gray-600", clazz)} on:click={() => {
    goto("/admin/roles/admin")
}}>
    <TableBodyCell class="move-handle px-0 opacity-0 group-hover:opacity-100 cursor-grab">
        <div class="flex items-center justify-center">
            <DotsVerticalOutline size="sm" class="dark:text-gray-300" />
        </div>
    </TableBodyCell>
    <TableBodyCell class="pl-2">
        {name}
    </TableBodyCell>
    <TableBodyCell class="text-center dark:text-gray-400 group-[.dragging]:hidden">
        <div class="flex items-center justify-center gap-2">
            1 <UsersSolid />
        </div>
    </TableBodyCell>
    <TableBodyCell class="group-[.dragging]:hidden">
        <div class="flex items-center justify-end gap-6">
            <PenSolid class="hidden group-hover:inline-block" />
            <TrashBinSolid
                aria-disabled={false}
                class={twMerge("dark:text-white dark:hover:text-red-600", false ? "cursor-not-allowed opacity-50" : "cursor-pointer")}
                on:click={(ev) => {
                    ev.stopPropagation()
                    console.log("delete")
                }}
            />
        </div>
    </TableBodyCell>
</TableBodyRow>