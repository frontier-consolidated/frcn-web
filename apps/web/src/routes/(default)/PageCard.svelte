<script lang="ts">
    export let src: string;
    export let href: string;
    export let alt: string = "";
</script>
<a {href}>
    <figure class="relative h-48 sm:h-60 cursor-pointer transition duration-300 filter hover:grayscale">
        <img class="rounded-lg h-full w-full object-cover" {src} {alt} />
        <figcaption class="absolute flex items-center w-full bottom-0 p-2 sm:p-4 bg-black bg-opacity-70 text-white font-semibold text-md">
            <slot />
        </figcaption>
    </figure>
</a>