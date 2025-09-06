<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { Avatar } from "flowbite-svelte";
	import { CloseCircleSolid } from "flowbite-svelte-icons";

	import { ConfirmationModal, Tooltip } from "$lib/components";
	import { Mutations, getApollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";
	import { viewUserProfile } from "$lib/stores/UserProfileViewStore";

	import type { PageData } from "./$types";

	export let role: PageData["role"];
	export let user: PageData["role"]["users"][number];

	let removeModalOpen = false;
</script>

<button
	class="flex cursor-pointer items-center justify-between rounded p-2 pe-4 dark:hover:bg-gray-800"
	on:click={() => {
		viewUserProfile(user.id);
	}}
>
	<div class="flex items-center gap-2">
		<Avatar rounded size="sm" src={user.avatarUrl} />
		<span class="text-md font-semibold dark:text-white">{user.name}</span>
	</div>
	<Tooltip>
		<CloseCircleSolid
			slot="icon"
			class="remove-user dark:text-gray-400 dark:hover:text-white"
			on:click={(e) => {
				e.stopPropagation();
				removeModalOpen = true;
			}}
		/>
		Remove User
	</Tooltip>
</button>

<ConfirmationModal
	title="Remove user from role"
	bind:open={removeModalOpen}
	on:confirm={async () => {
		const { errors } = await getApollo().mutate({
			mutation: Mutations.REMOVE_USER_ROLE,
			variables: {
				roleId: role.id,
				userId: user.id
			},
			errorPolicy: "all"
		});

		if (errors && errors.length > 0) {
			pushNotification({
				type: "error",
				message: "Failed to remove user from role"
			});
			console.error(errors);
			return;
		}

		await invalidate("app:currentrole");
		removeModalOpen = false;
	}}
>
	<span>Are you sure you want to remove <strong>{user.name}</strong> from this role?</span>
</ConfirmationModal>
