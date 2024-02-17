<script lang="ts">
	import { twMerge } from "tailwind-merge";

    const positions = {
        "top-right": "top-0 right-0",
        "top-left": "top-0 left-0",
        "bottom-right": "bottom-0 right-0",
        "bottom-left": "bottom-0 left-0"
    }

    export let src: string;
    export let alt: string = "";
    export let position: keyof typeof positions = "bottom-right"
    export let captionClass = "lg:absolute rounded-b-lg lg:rounded flex flex-col gap-3 lg:m-8 lg:max-w-[40%] p-6 bg-gray-800 lg:bg-black lg:bg-opacity-70 text-white"
    export let imgClass = "rounded-t-lg lg:rounded-lg object-cover w-full h-96 sm:h-[36rem]"
</script>

<figure class={twMerge("relative", $$restProps.class)}>
    <img class={imgClass} {src} {alt} />
    <figcaption class={twMerge(captionClass, positions[position])}>
        <slot />
    </figcaption>
</figure>