<script lang="ts">
	import { Modal } from "flowbite-svelte";
	import { createEventDispatcher } from "svelte";

	import Button from "../Button.svelte";

	const dispatch = createEventDispatcher();

	export let title: string;
	export let open: boolean = false;
</script>

<Modal {title} size="xs" bind:open on:close>
	<slot />
	<svelte:fragment slot="footer">
		<Button color="alternative" class="w-6/12" on:click={() => (open = false)}>Cancel</Button>
		<Button
			class="w-6/12"
			on:click={async () => {
				dispatch("confirm");
			}}>Confirm</Button
		>
	</svelte:fragment>
</Modal>
