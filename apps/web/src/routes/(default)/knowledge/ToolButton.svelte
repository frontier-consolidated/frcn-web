<script lang="ts">
import { Button } from "flowbite-svelte";
	import { twMerge } from "tailwind-merge";

	import MediaQuery from "$lib/components/MediaQuery.svelte";

    export let img: string = "";
    export let name: string;
    export let hideName = false;
</script>

<Button 
    outline 
    color="dark" 
    target="_blank"
    {...$$restProps} 
    class={twMerge("bg-gray-800 dark:text-white flex gap-2", $$restProps.class)} 
>
    <slot name="icon">
        <img src={img} alt={name} class="w-6 h-6 object-contain" />
    </slot>
    <MediaQuery query="(min-width: 430px)" let:matches>
        {#if matches && !hideName}
            <span>{name}</span>
        {/if}
    </MediaQuery>
</Button>
