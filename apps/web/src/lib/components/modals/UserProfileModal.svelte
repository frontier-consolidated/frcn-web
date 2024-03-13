<script lang="ts">
	import { Permission, hasPermission } from "@frcn/shared";
	import { Avatar, Badge, Dropdown, Modal } from "flowbite-svelte";
	import { AngleDownSolid, CirclePlusSolid, CloseSolid, StarSolid } from "flowbite-svelte-icons";
    import { locale } from "svelte-i18n";

	import type { UserFragmentFragment } from "$lib/graphql/__generated__/graphql";
	import { userProfileView } from "$lib/stores/UserProfileViewStore";
	import { user } from "$lib/stores/UserStore";

	import Hr from "./Hr.svelte";

    $: joinDate = new Intl.DateTimeFormat($locale!, {
        month: "long",
        year: "numeric"
    }).format(new Date($user.data?.createdAt ?? 0))

    function getAllRoles(data: UserFragmentFragment) {
        return [data.primaryRole, ...data.roles]
    }

    $: allRoles = $userProfileView ? getAllRoles($userProfileView) : []
    $: canEdit = hasPermission($user.data?.permissions ?? 0, Permission.ManageRoles)
</script>

<Modal size="sm" bodyClass="space-y-0" open={!!$userProfileView} dismissable outsideclose on:close={() => {
    userProfileView.set(null)
}}>
    <div>
        <div class="flex gap-4 items-center">
            <Avatar src={$userProfileView?.avatarUrl} rounded size="lg" />
            <div class="flex flex-col gap-1">
                <span class="text-2xl font-semibold text-white">{$userProfileView?.name}</span>
                <span class="text-sm">Created in {joinDate}</span>
            </div>
        </div>
        <Hr class="my-4 mt-6" />
        <div>
            <span class="block font-semibold text-white">Roles</span>
            <div class="flex flex-wrap items-center gap-1 mt-1">
                {#each allRoles as role}
                    {@const primaryRole = role.id === $userProfileView?.primaryRole.id}
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
                {#if canEdit}
                    <CirclePlusSolid size="sm" class="cursor-pointer hover:text-white" />
                {/if}
            </div>
        </div>
    </div>
</Modal>