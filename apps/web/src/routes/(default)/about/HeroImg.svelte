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
</script>

<figure class="relative">
    <img class="rounded-lg object-cover w-full h-[36rem]" {src} {alt} />
    <figcaption class={twMerge("absolute rounded flex flex-col gap-3 m-8 max-w-[60%] p-6 bg-black bg-opacity-70 text-white", positions[position])}>
        <slot />
    </figcaption>
</figure>