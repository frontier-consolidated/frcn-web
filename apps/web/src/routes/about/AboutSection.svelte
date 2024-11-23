<script lang="ts">
	import type { AboutSectionContainerPosition } from "@frcn/cms";
	import { twMerge } from "tailwind-merge";

	const positions = {
		"top-right": "top-0 right-0",
		"top-left": "top-0 left-0",
		"bottom-right": "bottom-0 right-0",
		"bottom-left": "bottom-0 left-0"
	} satisfies Record<AboutSectionContainerPosition, string>;

	const breakpoints = {
		sm: "640px",
		md: "768px",
		lg: "1024px",
		xl: "1280px",
		"2xl": "1536px"
	};

	export let title: string;
	export let src: string | undefined = undefined;
	export let srcset: string | undefined = undefined;
	export let alt: string = "";

	export let sources: Partial<Record<keyof typeof breakpoints, string>> = {};

	export let position: keyof typeof positions = "bottom-right";
	export let figureClass = "relative p-px rounded md:bg-gray-400 md:dark:bg-gray-800";
	export let captionClass =
		"relative md:absolute rounded-b md:rounded md:m-8 md:max-w-[50%] flex flex-col pb-6 md:py-6 text-gray-900 dark:text-white md:backdrop-blur-xl md:clip-tl-br-reverse-8 bg-white dark:bg-gray-900 md:bg-white/50 md:dark:bg-black/50";
	export let imgClass = "rounded-t md:rounded object-cover w-full h-72 sm:h-96 md:h-[36rem]";

	$: sourceEntries = Object.entries(sources) as [keyof typeof breakpoints, string][];
</script>

<figure class={twMerge(figureClass, $$restProps.class)}>
	<picture>
		{#each sourceEntries as [breakpoint, src]}
			<source media="(min-width: {breakpoints[breakpoint]})" srcset={src} />
		{/each}
		<img class={imgClass} {src} {srcset} {alt} />
	</picture>
	<figcaption class={twMerge(captionClass, positions[position])}>
		<div
			class="text-xl font-medium -mt-8 w-max max-w-full clip-tr-8 py-4 pl-8 pr-12 bg-white dark:bg-gray-900 md:mt-0 md:pt-0 md:bg-transparent md:dark:bg-transparent"
		>
			<span class="me-2 text-primary-700 dark:text-primary-500">///</span>
			{title}
		</div>
		<div class="px-8 flex flex-col gap-3">
			<slot />
		</div>
	</figcaption>
</figure>
