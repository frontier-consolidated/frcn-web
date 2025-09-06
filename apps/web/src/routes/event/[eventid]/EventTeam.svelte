<script lang="ts">
	import { Dropdown, DropdownItem } from "flowbite-svelte";
	import { ChevronDownOutline, DotsVerticalOutline } from "flowbite-svelte-icons";
	import { slide } from "svelte/transition";
	import { twMerge } from "tailwind-merge";

	import type { PageData } from "./$types";
	import EventMember from "./EventMember.svelte";

	export let event: PageData;
	let open = true;

	// TODO: change this to use team id
	$: optionsId = `event-team-options-${event.id}`;
</script>

<li class="mb-2 rounded bg-gray-200 dark:bg-gray-800">
	<button
		class={twMerge(
			"bg-primary-500 dark:bg-primary-900 hover:bg-primary-600 dark:hover:bg-primary-800 flex w-full items-center gap-2 rounded-t px-3 py-2 text-black text-white",
			!open && "rounded"
		)}
		on:click={() => (open = !open)}
	>
		<span class="text-md text-truncate line-clamp-2 flex-1 text-left font-semibold">Pod 1</span>
		<ChevronDownOutline
			class={twMerge("ml-auto h-3 w-3 transition-all", open && "rotate-180")}
			tabindex="-1"
		/>
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
				{#each event.members as member (member.id)}
					<EventMember bind:event {member} />
				{/each}
			{:else}
				<span class="block text-center text-sm text-gray-400 dark:text-gray-600">No members</span>
			{/if}
		</ul>
	{/if}
</li>

<Dropdown containerClass="rounded divide-y z-50" triggeredBy="#{optionsId}">
	<DropdownItem>Edit</DropdownItem>
	<DropdownItem class="dark:hover:bg-red-500">Delete Team</DropdownItem>
</Dropdown>
