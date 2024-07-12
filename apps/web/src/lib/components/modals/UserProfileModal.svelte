<script lang="ts">
	import { Permission, hasPermission } from "@frcn/shared";
	import { Avatar, Badge, Dropdown, Modal, Search } from "flowbite-svelte";
	import { AngleDownSolid, ArrowUpRightFromSquareOutline, CirclePlusSolid, CloseSolid, DiscordSolid, StarSolid } from "flowbite-svelte-icons";
    import { locale } from "svelte-i18n";

	import { Mutations, get_apollo } from "$lib/graphql";
	import type { UserFragmentFragment } from "$lib/graphql/__generated__/graphql";
	import { push_notification } from "$lib/stores/NotificationStore";
	import { roles_cache } from "$lib/stores/RolesCacheStore";
	import { user_profile_view } from "$lib/stores/UserProfileViewStore";
	import { user } from "$lib/stores/UserStore";

	import Hr from "../Hr.svelte";

    $: joinDate = $user_profile_view.data ? new Intl.DateTimeFormat($locale!, {
        month: "long",
        year: "numeric"
    }).format(new Date($user_profile_view.data.createdAt)) : "Loading...";

    function get_all_roles(data: UserFragmentFragment) {
        return [data.primaryRole, ...data.roles];
    }

    $: allRoles = $user_profile_view.open && $user_profile_view.data ? get_all_roles($user_profile_view.data) : [];
    $: canEdit = hasPermission($user.data?.permissions ?? 0, Permission.ManageRoles);

    let primary_role_search = "";
    let non_primary_role_search = "";
    $: giveableNonPrimaryRoles = $roles_cache.filter(role => !role.primary && !$user_profile_view.data?.roles.find(r => r.id === role.id)) ?? [];
    $: availablePrimaryRoles = $roles_cache.filter(role => role.primary && $user_profile_view.data?.primaryRole.id !== role.id) ?? [];
</script>

<Modal size="sm" bodyClass="space-y-0" open={$user_profile_view.open} dismissable outsideclose on:close={() => {
    user_profile_view.update(view => ({ ...view, open: false }));
}}>
    <div>
        <div class="flex gap-4 items-center mr-8">
            <Avatar src={$user_profile_view.data?.avatarUrl} rounded size="lg" />
            <div class="flex flex-col">
                <span class="text-2xl font-semibold text-black dark:text-white">{$user_profile_view.data?.name ?? "Loading..."}</span>
                <span class="text-sm">Created in {joinDate}</span>
            </div>
        </div>
        <Hr class="my-4" />
        <div class="flex flex-col gap-4">
            <a href={$user_profile_view.data ? `discord://-/users/${$user_profile_view.data.discordId}` : "/"} class="group font-medium text-sm text-gray-700 dark:text-gray-400 rounded border border-gray-600 p-3 flex items-center gap-2">
                <DiscordSolid class="text-discord" />
                <span>
                    {$user_profile_view.data?.discordName ?? "Wumpus"}
                </span>
                <span class="text-xs font-normal text-gray-500">
                    {$user_profile_view.data?.discordUsername ?? "Wumpus"}
                </span>
                <ArrowUpRightFromSquareOutline class="ml-auto group-hover:text-black dark:group-hover:text-gray-200" size="sm" />
            </a>
            <div>
                <span class="block font-semibold text-black dark:text-white">Roles</span>
                <div class="flex flex-wrap items-center gap-1 mt-1">
                    {#each allRoles as role}
                        {@const is_primary_role = role.id === $user_profile_view.data?.primaryRole.id}
                        <Badge data-role-id={role.id}>
                            {#if is_primary_role}
                                <StarSolid size="xs" class="me-1" tabindex="-1" />
                            {/if}
                            {role.name}
                            {#if canEdit}
                                {#if is_primary_role && availablePrimaryRoles.length > 0}
                                    <AngleDownSolid class="w-2 h-2 ms-2 cursor-pointer" />
                                    <Dropdown class="px-2 text-sm" >
                                        <div slot="header" class="px-2 py-1">
                                            <Search size="sm" bind:value={primary_role_search} />
                                        </div>
                                        {#each availablePrimaryRoles.filter(role => !primary_role_search || role.name.toLowerCase().includes(primary_role_search.trim().toLowerCase())) as role}
                                            <li>
                                                <button class="w-full rounded px-2 py-1 text-left hover:bg-gray-600 cursor-pointer" on:click={async () => {
                                                    if (!$user_profile_view.data) return;
            
                                                    const { errors } = await get_apollo().mutate({
                                                        mutation: Mutations.CHANGE_USER_PRIMARY_ROLE,
                                                        variables: {
                                                            roleId: role.id,
                                                            userId: $user_profile_view.data.id
                                                        },
                                                        errorPolicy: "all",
                                                    });
            
                                                    if (errors && errors.length > 0) {
                                                        push_notification({
                                                            type: "error",
                                                            message: "Failed to change primary role",
                                                        });
                                                        console.error(errors);
                                                        return;
                                                    }
                                                }}>
                                                    {role.name}
                                                </button>
                                            </li>
                                        {/each}
                                    </Dropdown>
                                {:else if !is_primary_role}
                                    <button class="focus:outline-none whitespace-normal m-0.5 rounded-sm focus:ring-1 p-0.5 ms-1.5 -me-1.5" on:click={async () => {
                                        if (!$user_profile_view.data) return;

                                        const { errors } = await get_apollo().mutate({
                                            mutation: Mutations.REMOVE_USER_ROLE,
                                            variables: {
                                                roleId: role.id,
                                                userId: $user_profile_view.data.id
                                            },
                                            errorPolicy: "all",
                                        });

                                        if (errors && errors.length > 0) {
                                            push_notification({
                                                type: "error",
                                                message: "Failed to remove role",
                                            });
                                            console.error(errors);
                                            return;
                                        }
                                    }}>
                                        <span class="sr-only">Remove {role.name}</span>
                                        <CloseSolid class="w-2 h-2" />
                                    </button>
                                {/if}
                            {/if}
                        </Badge>
                    {/each}
                    {#if canEdit && giveableNonPrimaryRoles.length > 0}
                        <CirclePlusSolid size="sm" class="cursor-pointer hover:text-white" />
                        <Dropdown class="px-2 text-sm">
                            <div slot="header" class="px-2 py-1">
                                <Search size="sm" bind:value={non_primary_role_search} />
                            </div>
                            {#each giveableNonPrimaryRoles.filter(role => !non_primary_role_search || role.name.toLowerCase().includes(non_primary_role_search.trim().toLowerCase())) as role}
                                <li>
                                    <button class="w-full rounded px-2 py-1 text-left hover:bg-gray-600 cursor-pointer" on:click={async () => {
                                        if (!$user_profile_view.data) return;

                                        const { errors } = await get_apollo().mutate({
                                            mutation: Mutations.GIVE_USER_ROLE,
                                            variables: {
                                                roleId: role.id,
                                                userId: $user_profile_view.data.id
                                            },
                                            errorPolicy: "all",
                                        });

                                        if (errors && errors.length > 0) {
                                            push_notification({
                                                type: "error",
                                                message: "Failed to give role",
                                            });
                                            console.error(errors);
                                            return;
                                        }
                                    }}>
                                        {role.name}
                                    </button>
                                </li>
                            {/each}
                        </Dropdown>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</Modal>