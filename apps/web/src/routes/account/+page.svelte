<script lang="ts">
	import { goto } from "$app/navigation";
	import { Alert } from "flowbite-svelte";
	import { CloseSolid } from "flowbite-svelte-icons";

	import { Button, ConfirmationModal, Head } from "$lib/components";
	import { Mutations, get_apollo } from "$lib/graphql";
	import { push_notification } from "$lib/stores/NotificationStore";
	import { user } from "$lib/stores/UserStore";

    let delete_modal_open = false;
</script>

<Head
	title="My Account"
	description="Manage your frontierconsolidated.com account"
/>

<div class="mt-20 flex flex-col mx-auto w-full max-w-6xl p-4">
    <Alert color="orange">
        <span>Better account management coming soon</span>
    </Alert>
    <div class="mt-4 flex justify-center items-center gap-2">
        <Button color="red" on:click={() => {
            delete_modal_open = true;
        }}>
            <CloseSolid class="me-2" tabindex="-1" /> Delete Account
        </Button>
    </div>
</div>

<ConfirmationModal title="Delete account" bind:open={delete_modal_open} on:confirm={async () => {
    const { errors } = await get_apollo().mutate({
        mutation: Mutations.DELETE_CURRENT_USER,
		errorPolicy: "all",
    });

    if (errors && errors.length > 0) {
        push_notification({
            type: "error",
            message: "Failed to delete account, please try again later",
        });
        console.error(errors);
        return;
    }

    delete_modal_open = false;
    user.update(value => ({
        ...value,
		loading: false,
		data: null,
	}));
	goto("/");
}}>
    <span>Are you sure you want to delete your account?</span>
</ConfirmationModal>