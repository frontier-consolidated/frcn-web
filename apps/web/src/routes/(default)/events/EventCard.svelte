<script lang="ts">
    import { strings } from "@frcn/shared";
	import type { AnyLocation } from "@frcn/shared/locations";
	import { Avatar, Breadcrumb, BreadcrumbItem, Button } from "flowbite-svelte";
	import { CalendarMonthSolid } from "flowbite-svelte-icons";
    
	import LocationBreadcrumbItem from "$lib/components/location/LocationBreadcrumbItem.svelte";
	import type { EventFragmentFragment } from "$lib/graphql/__generated__/graphql";
    import placeholder from "$lib/images/stock/placeholder.jpg"
	import { userProfileView } from "$lib/stores/UserProfileViewStore";
	import { user } from "$lib/stores/UserStore";

    export let event: Omit<EventFragmentFragment, "location"> & { location: AnyLocation[] | null }

    $: rsvped = event.members.find(member => member.user.id === $user.data?.id)
</script>

<a href="/event/{event.id}" class="group/card bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg border border-gray-200 dark:border-gray-700 divide-gray-200 dark:divide-gray-700 shadow-md flex p-0 w-full">
    <img src={event.imageUrl ?? placeholder} alt="Event thumbnail" class="object-cover h-auto w-24 hidden min-[480px]:block sm:w-48 rounded-s-lg group-hover/card:brightness-110" on:error={(e) => {
        e.currentTarget.setAttribute("src", placeholder)
    }} />
    <div class="flex flex-col px-4 py-2">
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
        <button class="w-max flex items-center gap-2 mt-1 group/owner" on:click={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (!event.owner) return;
            userProfileView.set(event.owner)
        }}>
            <span class="text-sm dark:text-white">By</span>
            <Avatar rounded size="xs" src={event.owner?.avatarUrl} />
            <span class="text-sm font-semibold text-gray-200 group-hover/owner:text-white">{event.owner?.name ?? "[DELETED USER]"}</span>
        </button>
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
    <div class="flex flex-col justify-between ml-auto shrink-0 w-36 p-4">
        <div class="flex flex-col">
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
            <Button color="red" on:click={(e) => {
                e.preventDefault()
            }}>
                UnRSVP
            </Button>
        {:else}
            <Button>
                RSVP
            </Button>
        {/if}
    </div>
</a>