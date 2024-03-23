<script lang="ts">
	import { Heading } from 'flowbite-svelte';

	import { Button, Hr } from '$lib/components';

    import type { PageData } from './$types';
    
    export let data: PageData;
</script>

<svelte:head>
	<title>CMS | Frontier Consolidated</title>
</svelte:head>

<div class="mt-24 flex flex-col gap-8 p-4 w-full max-w-6xl mx-auto">
    <Heading tag="h1" class="font-medium text-4xl">CMS</Heading>
    <Hr />
    <div class="flex flex-col items-center gap-2 p-4">
        {#each data.indexes as index}
        <div class="shadow-md bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded flex flex-col w-full p-4">
            <span class="font-medium">{index.getIdentifier() ?? "???"}</span>
            <span class="text-gray-500 text-xs">{index.id}</span>
        </div>
        {/each}
        <Button>
            Create Index
        </Button>
    </div>
</div>