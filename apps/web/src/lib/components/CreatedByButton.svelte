<script lang="ts">
	import { Avatar } from "flowbite-svelte";
	import { twMerge } from "tailwind-merge";

	import type { UserFragmentFragment } from "$lib/graphql/__generated__/graphql";
	import { viewUserProfile } from "$lib/stores/UserProfileViewStore";

	export let user: UserFragmentFragment | null | undefined;
</script>

<button
	{...$$restProps}
	class={twMerge("group/owner flex w-max items-center gap-2", $$restProps.class)}
	on:click={(e) => {
		e.preventDefault();
		e.stopPropagation();
		if (!user) return;
		viewUserProfile(user);
	}}
>
	<span class="text-sm dark:text-white">By</span>
	<Avatar rounded size="xs" src={user?.avatarUrl} />
	<span
		class="text-sm font-semibold text-gray-600 group-hover/owner:text-gray-800 dark:text-gray-200 dark:group-hover/owner:text-white"
		>{user?.name ?? "[DELETED USER]"}</span
	>
</button>
