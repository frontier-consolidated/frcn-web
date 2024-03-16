<script lang="ts">
	import { twMerge } from "tailwind-merge";

	import { Button, MediaQuery } from "$lib/components";

    export let img: string = "";
    export let name: string;
</script>

<Button
    color="dark" 
    target="_blank"
    {...$$restProps} 
    class={twMerge("bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white hover:bg-gray-300 flex gap-2", $$restProps.class)} 
>
    <img src={img} alt={name} class="w-6 h-6 object-contain" />
    <MediaQuery query="(min-width: 430px)" let:matches>
        {#if matches}
            <span>{name}</span>
        {/if}
    </MediaQuery>
</Button>
