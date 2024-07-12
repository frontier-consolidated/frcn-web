<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { Avatar } from "flowbite-svelte";
	import { CloseCircleSolid } from "flowbite-svelte-icons";

	import { ConfirmationModal, Tooltip } from "$lib/components";
	import { Mutations, get_apollo } from "$lib/graphql";
	import { push_notification } from "$lib/stores/NotificationStore";
	import { view_user_profile } from "$lib/stores/UserProfileViewStore";

	import type { PageData } from "./$types";

    export let role: PageData["role"];
    export let user: PageData["role"]["users"][number];

    let remove_modal_open = false;
</script>

<button class="flex justify-between items-center p-2 pe-4 rounded cursor-pointer dark:hover:bg-gray-800"  on:click={() => {
    view_user_profile(user.id);
}}>
    <div class="flex items-center gap-2">
        <Avatar rounded size="sm" src={user.avatarUrl} />
        <span class="text-md font-semibold dark:text-white">{user.name}</span>
    </div>
    <Tooltip>
        <CloseCircleSolid slot="icon" class="remove-user dark:text-gray-400 dark:hover:text-white" on:click={(e) => {
            e.stopPropagation();
            remove_modal_open = true;
        }} />
        Remove User
    </Tooltip>
</button>

<ConfirmationModal title="Remove user from role" bind:open={remove_modal_open} on:confirm={async () => {
    const { errors } = await get_apollo().mutate({
        mutation: Mutations.REMOVE_USER_ROLE,
        variables: {
            roleId: role.id,
            userId: user.id
        },
        errorPolicy: "all",
    });

    if (errors && errors.length > 0) {
        push_notification({
            type: "error",
            message: "Failed to remove user from role",
        });
        console.error(errors);
        return;
    }

    await invalidate("app:currentrole");
    remove_modal_open = false;
}}>
    <span>Are you sure you want to remove <strong>{user.name}</strong> from this role?</span>
</ConfirmationModal>
