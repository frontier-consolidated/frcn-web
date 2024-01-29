<script lang="ts">
	import { Img } from "flowbite-svelte";

    export let src: string;
    export let href: string;
    export let alt: string | undefined = undefined;
    export let caption: string;
</script>
<a {href}>
    <Img
        {src}
        {alt}
        class="rounded-lg"
        imgClass="h-full w-full object-cover"
        figClass="relative h-48 sm:h-64 cursor-pointer transition duration-300 filter hover:grayscale"
        captionClass="absolute w-full bottom-0 p-2 sm:p-4 bg-black bg-opacity-70 text-white font-semibold text-md"
        {caption}
    />
</a>