<script lang="ts">
    import { strings } from "@frcn/shared";
	import type { AnyLocation } from "@frcn/shared/locations";
	import { Avatar, Breadcrumb, BreadcrumbItem, Button } from "flowbite-svelte";
	import { CalendarMonthSolid } from "flowbite-svelte-icons";
    
	import CreatedByButton from "$lib/components/CreatedByButton.svelte";
	import LocationBreadcrumbItem from "$lib/components/location/LocationBreadcrumbItem.svelte";
	import RsvpModal from "$lib/components/RSVPModal.svelte";
	import { Mutations, getApollo } from "$lib/graphql";
	import type { EventFragmentFragment } from "$lib/graphql/__generated__/graphql";
    import placeholder from "$lib/images/stock/placeholder.jpg"
	import { pushNotification } from "$lib/stores/NotificationStore";
	import { user } from "$lib/stores/UserStore";

    export let event: Omit<EventFragmentFragment, "location"> & { location: AnyLocation[] | null }
    export let dependency: string | undefined = undefined;

    $: rsvped = event.members.find(member => member.user.id === $user.data?.id)
    let rsvpModalOpen = false;
</script>

<a href="/event/{event.id}" class="group/card flex flex-col sm:flex-row bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded clip-br-6 divide-gray-200 dark:divide-gray-700 shadow-md p-0 w-full">
    <img src={event.imageUrl ?? placeholder} alt="Event thumbnail" class="object-cover h-32 sm:h-auto sm:w-36 rounded-t sm:rounded-none sm:rounded-s group-hover/card:brightness-110" on:error={(e) => {
        e.currentTarget.setAttribute("src", placeholder)
    }} />
    <div class="flex flex-col px-4 py-3">
        <Breadcrumb
            ariaLabel="Event Type and Location"
            classOl="flex-wrap"
        >
            {#if event.eventType}
                <BreadcrumbItem home>
                    <svelte:fragment slot="icon">
                        <CalendarMonthSolid class="w-4 h-4 me-2" tabindex="-1" />
                    </svelte:fragment>
                    {strings.toTitleCase(event.eventType)} Event
                </BreadcrumbItem>
            {/if}
            {#if event.location}
                {#if event.location.length > 0}
                    {#each event.location as item}
                        <LocationBreadcrumbItem location={item} />
                    {/each}
                {:else}
                    <BreadcrumbItem>Anywhere</BreadcrumbItem>
                {/if}
            {:else}
                <BreadcrumbItem>???</BreadcrumbItem>
            {/if}
        </Breadcrumb>
        <span class="text-xl font-semibold dark:text-white">{event.name ? event.name : "Unnamed Event"}</span>
        <CreatedByButton class="mt-1" user={event.owner} />
        {#if event.summary}
            <div class="mt-2">
                <span class="block text-md font-semibold dark:text-white">
                    Summary
                </span>
                <span class="dark:text-gray-400">
                    {event.summary}
                </span>
            </div>
        {/if}
    </div>
    <div class="flex border-t sm:border-none border-gray-200 sm:flex-col items-end sm:items-center sm:items-stretch justify-between sm:ml-auto shrink-0 sm:w-36 p-4">
        <div class="flex flex-col flex-1 sm:flex-none">
            <div class="flex justify-center ml-4">
                {#each event.members.slice(0, 3) as member}
                    <Avatar src={member.user.avatarUrl} stacked />
                {/each}
                
                {#if event.members.length > 3}
                    <Avatar stacked class="bg-gray-700 text-white text-sm">+{event.members.length - 3}</Avatar>
                {/if}
            </div>
            <span class="text-sm text-center">{event.members.length} rsvps</span>
        </div>
        {#if rsvped}
            <Button disabled={!event.posted} color="red" class="h-max rounded clip-opposite-4" on:click={async (e) => {
                e.preventDefault()

                const { data: unrsvpData, errors } = await getApollo().mutate({
                    mutation: Mutations.UNRSVP_FOR_EVENT,
                    variables: {
                        eventId: event.id
                    },
                    errorPolicy: "all"
                })

                if (!unrsvpData?.success || (errors && errors.length > 0)) {
                    pushNotification({
                        type: "error",
                        message: "Failed to unrsvp for event",
                    });
                    console.error(errors);
                    return;
                }

                event.members = event.members.filter(member => member.user.id !== $user.data?.id)
            }}>
                UnRSVP
            </Button>
        {:else}
            <Button disabled={!event.posted} class="h-max rounded clip-opposite-4" on:click={async (e) => {
                e.preventDefault()
                rsvpModalOpen = true
            }}>
                RSVP
            </Button>
        {/if}
    </div>
</a>

<RsvpModal {event} {dependency} bind:open={rsvpModalOpen} />
