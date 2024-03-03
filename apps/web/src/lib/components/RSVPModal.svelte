<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { Button, Label, Modal } from "flowbite-svelte";

	import { Mutations, getApollo } from "$lib/graphql";
	import type { EventFragmentFragment } from "$lib/graphql/__generated__/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";

	import BetterSelect from "./select/BetterSelect.svelte";

    export let event: Omit<EventFragmentFragment, "location">;
    export let open: boolean = false;
    
    let rsvpRole: string | null = null;
</script>

<Modal title="RSVP for '{event.name}'" placement="top-center" outsideclose bind:open bodyClass="overflow-y-visible">
	<div>
		<Label for="event-rsvp-role" class="mb-2">RSVP Role</Label>
		<BetterSelect
			id="event-rsvp-role"
			name="Event RSVP Role"
			options={event.roles.map((role) => ({
				value: role.id,
				name: role.name,
			}))}
			required
			bind:value={rsvpRole}
		/>
	</div>
	<svelte:fragment slot="footer">
		<Button disabled={!rsvpRole} on:click={async () => {
			if (!rsvpRole) return;
			
            const { data: rsvpData, errors } = await getApollo().mutate({
                mutation: Mutations.RSVP_FOR_EVENT,
                variables: {
                    eventId: event.id,
                    rsvpId: rsvpRole
                }
            })

            if (!rsvpData?.success || (errors && errors.length > 0)) {
                pushNotification({
                    type: "error",
                    message: "Failed to rsvp for event",
                });
                console.error(errors);
                return;
            }

            await invalidate("app:events")
            open = false;
		}}>RSVP</Button>
		<Button color="alternative" on:click={() => open = false}>Cancel</Button>
  	</svelte:fragment>
</Modal>