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
    export let captionClass = "sm:absolute rounded-b-lg sm:rounded flex flex-col gap-3 sm:m-8 sm:max-w-[60%] p-6 bg-gray-800 sm:bg-black sm:bg-opacity-70 text-white"
    export let imgClass = "rounded-t-lg sm:rounded-lg object-cover w-full h-96 sm:h-[36rem]"
</script>

<figure class={twMerge("relative", $$restProps.class)}>
    <img class={imgClass} {src} {alt} />
    <figcaption class={twMerge(captionClass, positions[position])}>
        <slot />
    </figcaption>
</figure>