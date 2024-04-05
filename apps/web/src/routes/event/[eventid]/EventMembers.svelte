<script lang="ts">
	import { Heading } from "flowbite-svelte";

import type { PageData } from "./$types";
	import EventMember from "./EventMember.svelte";

    export let data: PageData;
</script>

<div class="flex flex-col gap-2">
    <Heading tag="h2" class="text-lg">{data.members.length} Event Member{data.members.length !== 1 ? "s" : ""}</Heading>
    <div class="flex flex-col">
        {#if data.members.length > 0}
            {#each data.members as member}
                <EventMember bind:event={data} {member} />
            {/each}
        {:else}
            <span class="block text-sm text-center dark:text-gray-600">No members</span>
        {/if}
    </div>
</div>