<script lang="ts">
	import { Permission, hasPermission } from "@frcn/shared";
	import { Avatar, Badge, Modal } from "flowbite-svelte";
	import { CirclePlusSolid, PlusSolid, StarSolid } from "flowbite-svelte-icons";
    import { locale } from "svelte-i18n";

	import type { UserFragmentFragment } from "$lib/graphql/__generated__/graphql";
	import { userProfileView } from "$lib/stores/UserProfileViewStore";
	import { user } from "$lib/stores/UserStore";

	import Hr from "./Hr.svelte";

    user.subscribe(val => {
        if (val.data) {
            userProfileView.set(val.data)
        }
    })

    $: joinDate = new Intl.DateTimeFormat($locale!, {
        month: "long",
        year: "numeric"
    }).format(new Date($user.data?.createdAt ?? 0))

    function getAllRoles(data: UserFragmentFragment) {
        return [data.primaryRole, ...data.roles]
    }

    $: allRoles = $userProfileView ? getAllRoles($userProfileView) : []
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
                            <StarSolid size="xs" class="me-1" />
                        {/if}
                        {role.name}
                    </Badge>
                {/each}
                {#if hasPermission($user.data?.permissions ?? 0, Permission.ManageRoles)}
                    <CirclePlusSolid size="sm" class="cursor-pointer hover:text-white" />
                {/if}
            </div>
        </div>
    </div>
</Modal>