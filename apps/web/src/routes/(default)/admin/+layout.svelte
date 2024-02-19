<script lang="ts">
    import { page } from '$app/stores';
    import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import { GearSolid, TagSolid, UserGroupSolid, UserHeadsetSolid } from 'flowbite-svelte-icons';

    $: activeUrl = $page.url.pathname;
</script>

<section class="flex flex-col lg:flex-row gap-8">
    <Sidebar asideClass="shrink-0 w-64" {activeUrl}>
        <SidebarWrapper>
            <SidebarGroup>
                <div class="flex items-center gap-2 dark:text-gray-400 px-2">
                    <span class="self-center font-semibold whitespace-nowrap">
                        System Settings
                    </span>
                </div>
                <SidebarItem label="General" href="/admin/general">
                    <svelte:fragment slot="icon">
                        <GearSolid tabindex="-1" />
                    </svelte:fragment>
                </SidebarItem>
                <SidebarItem label="Channels" href="/admin/channels">
                    <svelte:fragment slot="icon">
                        <UserHeadsetSolid tabindex="-1" />
                    </svelte:fragment>
                </SidebarItem>
                <SidebarItem label="Roles" href="/admin/roles">
                    <svelte:fragment slot="icon">
                        <TagSolid tabindex="-1" />
                    </svelte:fragment>
                </SidebarItem>
            </SidebarGroup>
            <SidebarGroup border>
                <div class="flex items-center gap-2 dark:text-gray-400 px-2">
                    <span class="self-center font-semibold whitespace-nowrap">
                        User Management
                    </span>
                </div>
                <SidebarItem label="Users" href="/admin/users">
                    <svelte:fragment slot="icon">
                        <UserGroupSolid tabindex="-1" />
                    </svelte:fragment>
                </SidebarItem>
            </SidebarGroup>
        </SidebarWrapper>
    </Sidebar>
    <div class="flex-1 flex flex-col overflow-y-auto min-h-[80vh] py-4 px-3 bg-gray-50 rounded dark:bg-gray-900">
        <slot />
    </div>
</section>