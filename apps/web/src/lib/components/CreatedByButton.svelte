<script lang="ts">
	import { Avatar } from "flowbite-svelte";
	import { twMerge } from "tailwind-merge";

	import type { UserFragmentFragment } from "$lib/graphql/__generated__/graphql";
	import { userProfileView } from "$lib/stores/UserProfileViewStore";

    export let user: UserFragmentFragment | null | undefined;
</script>

<button {...$$restProps} class={twMerge("w-max flex items-center gap-2 group/owner", $$restProps.class)} on:click={(e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return;
    userProfileView.set(user)
}}>
    <span class="text-sm dark:text-white">By</span>
    <Avatar rounded size="xs" src={user?.avatarUrl} />
    <span class="text-sm font-semibold text-gray-200 group-hover/owner:text-white">{user?.name ?? "[DELETED USER]"}</span>
</button>