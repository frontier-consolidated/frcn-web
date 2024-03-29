<script lang="ts">
	import { goto } from "$app/navigation";
	import { Alert } from "flowbite-svelte";
	import { CloseSolid } from "flowbite-svelte-icons";

	import { Button, ConfirmationModal } from "$lib/components";
	import { Mutations, getApollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";
	import { user } from "$lib/stores/UserStore";

    let deleteModalOpen = false
</script>

<svelte:head>
    <title>My Account | Frontier Consolidated</title>
    <meta name="description" content="Manage your account" />
</svelte:head>

<div class="mt-20 flex flex-col mx-auto w-full max-w-6xl p-4">
    <Alert color="orange">
        <span>Better account management coming soon</span>
    </Alert>
    <div class="mt-4 flex justify-center items-center gap-2">
        <Button color="red" on:click={() => {
            deleteModalOpen = true;
        }}>
            <CloseSolid class="me-2" tabindex="-1" /> Delete Account
        </Button>
    </div>
</div>

<ConfirmationModal title="Delete account" bind:open={deleteModalOpen} on:confirm={async () => {
    const { errors } = await getApollo().mutate({
        mutation: Mutations.DELETE_CURRENT_USER,
		errorPolicy: "all",
    })

    if (errors && errors.length > 0) {
        pushNotification({
            type: "error",
            message: "Failed to delete account, please try again later",
        });
        console.error(errors);
        return;
    }

    deleteModalOpen = false;
    user.set({
		loading: false,
		data: null,
	});
	goto("/")
}}>
    <span>Are you sure you want to delete your account?</span>
</ConfirmationModal>