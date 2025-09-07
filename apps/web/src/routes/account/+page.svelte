<script lang="ts">
	import { Alert } from "flowbite-svelte";
	import { CloseSolid } from "flowbite-svelte-icons";

	import { goto } from "$app/navigation";
	import { Button, ConfirmationModal, Head } from "$lib/components";
	import { Mutations, getApollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";
	import { user } from "$lib/stores/UserStore";

	let deleteModalOpen = false;
</script>

<Head title="My Account" description="Manage your frontierconsolidated.com account" />

<div class="mx-auto mt-20 flex w-full max-w-6xl flex-col p-4">
	<Alert color="orange">
		<span>Better account management coming soon</span>
	</Alert>
	<div class="mt-4 flex items-center justify-center gap-2">
		<Button
			color="red"
			on:click={() => {
				deleteModalOpen = true;
			}}
		>
			<CloseSolid class="me-2" tabindex="-1" /> Delete Account
		</Button>
	</div>
</div>

<ConfirmationModal
	title="Delete account"
	bind:open={deleteModalOpen}
	on:confirm={async () => {
		const { errors } = await getApollo().mutate({
			mutation: Mutations.DELETE_CURRENT_USER,
			errorPolicy: "all"
		});

		if (errors && errors.length > 0) {
			pushNotification({
				type: "error",
				message: "Failed to delete account, please try again later"
			});
			console.error(errors);
			return;
		}

		deleteModalOpen = false;
		user.update((value) => ({
			...value,
			loading: false,
			data: null
		}));
		goto("/");
	}}
>
	<span>Are you sure you want to delete your account?</span>
</ConfirmationModal>
