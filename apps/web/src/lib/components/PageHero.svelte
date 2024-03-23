<script lang="ts">
    export let srcset: string;
    export let alt = "Page hero"
</script>

<div class="relative">
	<img {srcset} {alt} class="w-full object-cover min-h-[20rem] h-[50vh] brightness-90 bg-slate-950 mask-fade-bottom" />
	<div class="absolute top-0 left-0 h-full w-full flex flex-col justify-center items-center gap-4 text-center">
		<slot />
	</div>
</div>

<style>
	.mask-fade-bottom {
		mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 90%, transparent 100%);
	}
</style>