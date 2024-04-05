<script lang="ts">
	import { twMerge } from "tailwind-merge";

    export let srcset: string;
    export let alt = "Page hero";
	export let height = "h-[50vh]";
</script>

<div class="relative">
	<img {srcset} {alt} class={twMerge("w-full object-cover min-h-[20rem] brightness-90 bg-slate-950 mask-fade-bottom", height)} />
	<div class="absolute top-0 left-0 h-full w-full flex flex-col justify-center items-center gap-4 text-center pt-8">
		<slot />
	</div>
</div>

<style>
	.mask-fade-bottom {
		mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 90%, transparent 100%);
	}
</style>