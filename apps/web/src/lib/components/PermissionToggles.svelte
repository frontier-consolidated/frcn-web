<script lang="ts">
	import { Permission } from "@frcn/shared";
	import { Helper, Toggle } from "flowbite-svelte";

	import Hr from "./Hr.svelte";

    const permissionDefs = [
        {
            permission: Permission.CreateEvents,
            name: "Create Events",
            help: "Allows creating, editing, posting and deleting of their own events"
        },
        {
            permission: Permission.ManageEvents,
            name: "Create Events",
            help: "Allows creating, editing, posting and deleting of all events"
        },
        {
            permission: Permission.CreateResources,
            name: "Create Resources",
            help: "Allows creating, editing and deleting of their own guides & resources"
        },
        {
            permission: Permission.ManageResources,
            name: "Create Events",
            help: "Allows creating, editing and deleting of all guides & resources"
        },
        {
            permission: Permission.CmsRead,
            name: "CMS Read",
            help: "Allows reading of CMS content"
        },
        {
            permission: Permission.CmsWrite,
            name: "CMS Write",
            help: "Allows creating, editing and deleting of CMS content"
        },
        {
            permission: Permission.ManageSystem,
            name: "Manage System",
            help: "Allows modifying of general system settings and event channels"
        },
        {
            permission: Permission.Admin,
            name: "Administrator",
            help: "[DANGEROUS] This permission enables use of all permissions and overrides role hierarchy"
        },
    ] satisfies { permission: Permission, name: string, help: string }[]

    export let permissions: number;
    export let disableToggles: Partial<Record<Permission, boolean>> = {};

    function togglePermission(ev: Event, permission: Permission) {
		const target = (ev.target) as HTMLInputElement
		if (target.checked) {
			permissions |= permission
		} else {
			permissions ^= permission
		}
	}
</script>

<div class="flex flex-col gap-4 p-4 mt-2" {...$$restProps}>
    {#each permissionDefs as info, i}
        {@const disabled = disableToggles[info.permission]}
        {@const checked = (permissions & info.permission) > 0}
        <div>
            <Toggle
                {disabled}
                {checked}
                on:change={(ev) => togglePermission(ev, info.permission)}
            >
                {info.name}
                <slot {info} {checked} {disabled} />
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