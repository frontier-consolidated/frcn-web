<script lang="ts">
	import { twMerge } from "tailwind-merge";

    const positions = {
        "top-right": "top-0 right-0",
        "top-left": "top-0 left-0",
        "bottom-right": "bottom-0 right-0",
        "bottom-left": "bottom-0 left-0"
    }

    const breakpoints = {
		sm: "640px",
		md: "768px",
		lg: "1024px",
		xl: "1280px",
		"2xl": "1536px",
	};

    export let src: string;
    export let alt: string = "";
    
    export let sources: Partial<Record<keyof typeof breakpoints, string>> = {};

    export let position: keyof typeof positions = "bottom-right"
    export let captionClass = "md:absolute rounded-b-lg md:rounded flex flex-col gap-3 md:m-8 md:max-w-[45%] p-4 bg-gray-800 md:bg-black md:bg-opacity-70 text-white"
    export let imgClass = "rounded-t-lg md:rounded-lg object-cover w-full h-72 sm:h-96 md:h-[36rem]"

    $: sourceEntries = Object.entries(sources) as [keyof typeof breakpoints, string][]
</script>

<figure class={twMerge("relative", $$restProps.class)}>
    <picture>
        {#each sourceEntries as [breakpoint, src]}
            <source media="(min-width: {breakpoints[breakpoint]})" srcset={src} />
        {/each}
        <img class={imgClass} {src} {alt} />
    </picture>
    <figcaption class={twMerge(captionClass, positions[position])}>
        <slot />
    </figcaption>
</figure>