<script lang="ts">
	import { goto } from "$app/navigation";
	import { Permission, hasPermission } from "@frcn/shared";
	import { Button } from "flowbite-svelte";
	import { CirclePlusSolid } from "flowbite-svelte-icons";

	import { Mutations, getApollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";
	import { user } from "$lib/stores/UserStore";
</script>

{#if hasPermission($user.data?.permissions ?? 0, Permission.CreateEvents)}
    <Button
        class="sm:shrink-0 rounded clip-opposite-3"
        on:click={async () => {
            try {
                const { data: createData } = await getApollo().mutate({
                    mutation: Mutations.CREATE_EVENT,
                });
    
                if (createData && createData.event) {
                    goto(`/event/${createData.event}`);
                }
            } catch (err) {
                pushNotification({
                    type: "error",
                    message: "Failed to create event"
                })
                console.error(err)
            }
        }}
    >
        <CirclePlusSolid class="me-2" tabindex="-1" /> Create New Event
    </Button>
{/if}