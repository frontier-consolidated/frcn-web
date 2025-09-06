<script lang="ts">
	import { page } from "$app/stores";
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from "flowbite-svelte";
	import { GearSolid, TagSolid, UserGroupSolid, UserHeadsetSolid } from "flowbite-svelte-icons";
	import type { ComponentType, SvelteComponent } from "svelte";

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
	] satisfies {
		name: string;
		pages: { name: string; href: string; icon?: ComponentType<SvelteComponent> }[];
	}[];

	$: activeUrl = $page.url.pathname;
</script>

<section class="mx-auto mt-24 flex w-full max-w-6xl flex-col gap-8 px-4 lg:flex-row">
	<Sidebar asideClass="shrink-0 w-64 hidden lg:block" {activeUrl}>
		<SidebarWrapper>
			{#each pageGroup as group, i}
				<SidebarGroup border={i > 0}>
					<div class="flex items-center gap-2 px-2 dark:text-gray-400">
						<span class="self-center whitespace-nowrap font-semibold">
							{group.name}
						</span>
					</div>
					{#each group.pages as page}
						<SidebarItem label={page.name} href={page.href} class="clip-tl-br-4 rounded">
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
		options={pageGroup.map((group) => ({
			name: group.name,
			options: group.pages.map((page) => ({
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
	<div
		class="flex min-h-[80vh] flex-1 flex-col overflow-y-auto rounded bg-gray-50 px-3 py-4 dark:bg-gray-900"
	>
		<slot />
	</div>
</section>
