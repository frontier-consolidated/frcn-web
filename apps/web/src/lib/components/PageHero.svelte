<script lang="ts">
	import { twMerge } from "tailwind-merge";

	export let srcset: string;
	export let alt = "Page hero";
	export let height = "h-[50vh]";
</script>

<div class="relative">
	<img
		{srcset}
		{alt}
		class={twMerge(
			"mask-fade-bottom min-h-[20rem] w-full bg-slate-950 object-cover brightness-90",
			height
		)}
	/>
	<div
		class="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center gap-4 pt-8 text-center"
	>
		<slot />
	</div>
</div>

<style>
	.mask-fade-bottom {
		mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 90%, transparent 100%);
	}
</style>
