<script lang="ts">
	import { page } from "$app/stores";
	import { Permission, hasPermission } from "@frcn/shared";
	import { Avatar, Badge, Dropdown, Modal, Search } from "flowbite-svelte";
	import { AngleDownSolid, ArrowUpRightFromSquareOutline, CirclePlusSolid, CloseSolid, DiscordSolid, StarSolid } from "flowbite-svelte-icons";
    import { locale } from "svelte-i18n";

	import type { UserFragmentFragment } from "$lib/graphql/__generated__/graphql";
	import { userProfileView } from "$lib/stores/UserProfileViewStore";
	import { user } from "$lib/stores/UserStore";

	import Hr from "../Hr.svelte";

    $: joinDate = $userProfileView.data ? new Intl.DateTimeFormat($locale!, {
        month: "long",
        year: "numeric"
    }).format(new Date($userProfileView.data.createdAt)) : "Loading...";

    function getAllRoles(data: UserFragmentFragment) {
        return [data.primaryRole, ...data.roles];
    }

    $: allRoles = $userProfileView.open && $userProfileView.data ? getAllRoles($userProfileView.data) : [];
    $: canEdit = hasPermission($user.data?.permissions ?? 0, Permission.ManageRoles);
</script>

<Modal size="sm" bodyClass="space-y-0" open={$userProfileView.open} dismissable outsideclose on:close={() => {
    userProfileView.update(view => ({ ...view, open: false }));
}}>
    <div>
        <div class="flex gap-4 items-center">
            <Avatar src={$userProfileView.data?.avatarUrl} rounded size="lg" />
            <div class="flex flex-col gap-1">
                <span class="text-2xl font-semibold text-black dark:text-white">{$userProfileView.data?.name ?? "Loading..."}</span>
                <span class="text-sm">Created in {joinDate}</span>
            </div>
        </div>
        <Hr class="my-4 mt-6" />
        <div class="flex flex-col gap-4">
            <a href={$userProfileView.data ? `discord://-/users/${$userProfileView.data.discordId}` : "/"} class="group font-medium text-sm text-gray-700 dark:text-gray-400 rounded border border-gray-600 p-3 flex items-center gap-2">
                <DiscordSolid class="text-discord" />
                <span>
                    {$userProfileView.data?.discordName ?? "Wumpus"}
                </span>
                <span class="text-xs font-normal text-gray-500">
                    {$userProfileView.data?.discordUsername ?? "Wumpus"}
                </span>
                <ArrowUpRightFromSquareOutline class="ml-auto group-hover:text-black dark:group-hover:text-gray-200" size="sm" />
            </a>
            <div>
                <span class="block font-semibold text-black dark:text-white">Roles</span>
                <div class="flex flex-wrap items-center gap-1 mt-1">
                    {#each allRoles as role}
                        {@const primaryRole = role.id === $userProfileView.data?.primaryRole.id}
                        <Badge data-role-id={role.id}>
                            {#if primaryRole}
                                <StarSolid size="xs" class="me-1" tabindex="-1" />
                            {/if}
                            {role.name}
                            {#if canEdit}
                                {#if primaryRole}
                                    <AngleDownSolid class="w-2 h-2 ms-2 cursor-pointer" />
                                    <Dropdown>
        
                                    </Dropdown>
                                {:else}
                                    <button class="focus:outline-none whitespace-normal m-0.5 rounded-sm focus:ring-1 p-0.5 ms-1.5 -me-1.5">
                                        <span class="sr-only">Remove {role.name}</span>
                                        <CloseSolid class="w-2.5 h-2.5" />
                                    </button>
                                {/if}
                            {/if}
                        </Badge>
                    {/each}
                    {#if canEdit && $page.data.roles}
                        <CirclePlusSolid size="sm" class="cursor-pointer hover:text-white" />
                        <Dropdown class="px-2 text-sm">
                            <div slot="header" class="px-2 py-1">
                                <Search size="sm" />
                            </div>
                            {#each $page.data.roles.filter(role => !role.primary) as role}
                                <li class="rounded px-2 py-1 hover:bg-gray-600 cursor-pointer">{role.name}</li>
                            {/each}
                        </Dropdown>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</Modal>