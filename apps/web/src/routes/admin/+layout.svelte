<script lang="ts">
    import { page } from "$app/stores";
    import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from "flowbite-svelte";
	import { GearSolid, TagSolid, UserGroupSolid, UserHeadsetSolid } from "flowbite-svelte-icons";

	import NavigationSelect from "$lib/components/select/NavigationSelect.svelte";

    const pageGroup = [
        {
            name: "System Settings",
            pages: [
                {
                    name: "General",
                    href: "/admin/general",
                    icon: GearSolid
                },
                {
                    name: "Roles",
                    href: "/admin/roles",
                    icon: TagSolid
                }
            ]
        },
        {
            name: "Events",
            pages: [
                {
                    name: "Channels",
                    href: "/admin/channels",
                    icon: UserHeadsetSolid
                }
            ]
        },
        {
            name: "User Management",
            pages: [
                {
                    name: "Users",
                    href: "/admin/users",
                    icon: UserGroupSolid
                }
            ]
        }
    // eslint-disable-next-line no-undef
    ] satisfies { name: string, pages: { name: string, href: string, icon?: ConstructorOfATypedSvelteComponent }[] }[];

    $: activeUrl = $page.url.pathname;
</script>

<section class="flex flex-col lg:flex-row gap-8 px-4 mx-auto w-full max-w-6xl mt-24">
    <Sidebar asideClass="shrink-0 w-64 hidden lg:block" {activeUrl}>
        <SidebarWrapper>
            {#each pageGroup as group, i}
                <SidebarGroup border={i > 0}>
                    <div class="flex items-center gap-2 dark:text-gray-400 px-2">
                        <span class="self-center font-semibold whitespace-nowrap">
                            {group.name}
                        </span>
                    </div>
                    {#each group.pages as page}
                        <SidebarItem label={page.name} href={page.href} class="rounded clip-opposite-4">
                            <svelte:fragment slot="icon">
                                {#if page.icon}
                                    <svelte:component this={page.icon} tabindex="-1" class="outline-none" />
                                {/if}
                            </svelte:fragment>
                        </SidebarItem>
                    {/each}
                </SidebarGroup>
            {/each}
        </SidebarWrapper>
    </Sidebar>
    <NavigationSelect
        {activeUrl}
        class="lg:hidden"
        options={pageGroup.map(group => ({
            name: group.name,
            options: group.pages.map(page => ({
                name: page.name,
                href: page.href,
                style: { icon: page.icon }
            }))
        }))} 
        let:option
    >
        <div class="flex items-center gap-2">
            {#if option.style}
                <svelte:component this={option.style.icon} tabindex="-1" class="outline-none" size="sm" />
            {/if}
            <span>{option.name}</span>
        </div>
    </NavigationSelect>
    <div class="flex-1 flex flex-col overflow-y-auto min-h-[80vh] py-4 px-3 bg-gray-50 rounded dark:bg-gray-900">
        <slot />
    </div>
</section>