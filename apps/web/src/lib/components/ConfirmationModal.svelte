<script lang="ts">
	import { Button, Modal } from "flowbite-svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher()

    export let title: string;
    export let open: boolean = false;
</script>

<Modal {title} size="xs" bind:open>
    <slot />
    <svelte:fragment slot="footer">
		<Button class="flex-1" on:click={async () => {
			dispatch("confirm")
		}}>Confirm</Button>
		<Button color="alternative" class="flex-1" on:click={() => open = false}>Cancel</Button>
  	</svelte:fragment>
</Modal>