<script lang="ts">
	import { Dropdown, DropdownItem } from "flowbite-svelte";
	import { ChevronDownOutline, DotsVerticalOutline } from "flowbite-svelte-icons";
	import { slide } from "svelte/transition";
	import { twMerge } from "tailwind-merge";

	import type { PageData } from "./$types";
	import EventMember from "./EventMember.svelte";

    export let event: PageData
    let open = true;

    // TODO: change this to use team id
    $: optionsId = `event-team-options-${event.id}`
</script>

<li class="rounded mb-2 bg-gray-200 dark:bg-gray-800">
    <button class={twMerge("rounded-t flex items-center gap-2 py-2 px-3 w-full text-black text-white bg-primary-500 dark:bg-primary-900 hover:bg-primary-600 dark:hover:bg-primary-800", !open && "rounded")} on:click={() => (open = !open)}>
        <span class="flex-1 text-md font-semibold text-left text-truncate line-clamp-2">Pod 1</span>
        <ChevronDownOutline class={twMerge("ml-auto transition-all w-3 h-3", open && "rotate-180")} tabindex="-1" />
        <DotsVerticalOutline
            id={optionsId}
            class="dark:hover:text-gray-500"
            size="sm"
            on:click={(e) => e.stopPropagation()}
        />
    </button>
    {#if open}
        <ul class="p-2" transition:slide>
            {#if event.members.length > 0}
                {#each event.members as member}
                    <EventMember bind:event {member} />
                {/each}
            {:else}
                <span class="block text-sm text-center text-gray-400 dark:text-gray-600">No members</span>
            {/if}
        </ul>
    {/if}
</li>

<Dropdown containerClass="rounded divide-y z-50" triggeredBy="#{optionsId}">
    <DropdownItem>
		Edit
	</DropdownItem>
	<DropdownItem class="dark:hover:bg-red-500">
		Delete Team
	</DropdownItem>
</Dropdown>
