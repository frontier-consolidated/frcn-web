<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { Label, Modal } from "flowbite-svelte";

	import { Mutations, get_apollo } from "$lib/graphql";
	import type { EventFragmentFragment } from "$lib/graphql/__generated__/graphql";
	import { push_notification } from "$lib/stores/NotificationStore";

	import Button from "../Button.svelte";
	import Select from "../select/Select.svelte";

    export let event: Omit<EventFragmentFragment, "location">;
    export let open: boolean = false;
    export let dependency = "app:events";

    let rsvp_role: string | null = null;
</script>

<Modal title="RSVP for '{event.name}'" placement="top-center" outsideclose bind:open bodyClass="overflow-y-visible">
	<div>
		<Label for="event-rsvp-role" class="mb-2">RSVP Role</Label>
		<Select
			id="event-rsvp-role"
			name="event-rsvp-role"
			options={event.rsvpRoles.map((role) => ({
				value: role.id,
				name: role.name,
			}))}
			required
			bind:value={rsvp_role}
		/>
	</div>
	<svelte:fragment slot="footer">
		<Button disabled={!rsvp_role} on:click={async () => {
			if (!rsvp_role) return;
			
            const { data: rsvp_data, errors } = await get_apollo().mutate({
                mutation: Mutations.RSVP_FOR_EVENT,
                variables: {
                    eventId: event.id,
                    rsvpId: rsvp_role
                }
            });

            if (!rsvp_data?.success || (errors && errors.length > 0)) {
                push_notification({
                    type: "error",
                    message: "Failed to rsvp for event",
                });
                console.error(errors);
                return;
            }

            await invalidate(dependency);
			push_notification({
				type: "success",
				message: "RSVPed for event",
			});
            open = false;
		}}>RSVP</Button>
		<Button color="alternative" on:click={() => open = false}>Cancel</Button>
  	</svelte:fragment>
</Modal>