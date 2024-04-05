<script lang="ts">
	import { twMerge } from "tailwind-merge";

	type Direction = "left" | "up";
	export let direction: Direction = "left";
	export let pauseOnHover: boolean = true;
	export let reverse: boolean = false;
	export let fade: boolean = false;
	export let innerClass: string = "";
    export let durationClass: string = "[--duration:5s]";
	export let numberOfCopies: number = 10;
</script>

<div
	class={twMerge("group flex gap-[1rem] overflow-hidden", $$restProps.class, direction === "left" ? "flex-row" : "flex-col")}
	style={`mask-image: ${
		fade
			? `linear-gradient(${
					direction === "left" ? "to right" : "to bottom"
				}, transparent 0%, rgba(0, 0, 0, 1.0) 10%, rgba(0, 0, 0, 1.0) 90%, transparent 100%)`
			: "none"
	};
	  -webkit-mask-image: ${
			fade
				? `linear-gradient(${
						direction === "left" ? "to right" : "to bottom"
					}, transparent 0%, rgba(0, 0, 0, 1.0) 10%, rgba(0, 0, 0, 1.0) 90%, transparent 100%)`
				: "none"
		};
	  `}
>
	{#each Array(numberOfCopies).fill(0) as _, i (i)}
		<div
			class={twMerge(
				"flex justify-around gap-[1rem] [--gap:1rem] shrink-0",
                durationClass,
				direction === "left"
					? "animate-marquee-left flex-row"
					: "animate-marquee-up flex-col",
				pauseOnHover && "group-hover:[animation-play-state:paused]",
				reverse && "direction-reverse",
				innerClass
			)}
		>
			<slot />
		</div>
	{/each}
</div>

<style>
    @keyframes marquee-left {
        from {
            transform: translateX(0);
        }

        to {
            transform: translateX(calc(-100% - var(--gap)));
        }
    }

    .animate-marquee-left {
        animation: marquee-left var(--duration, 40s) linear infinite;
    }

    @keyframes marquee-up {
        from {
            transform: translateY(0);
        }

        to {
            transform: translateY(calc(-100% - var(--gap)));
        }
    }

    .animate-marquee-up {
        animation: marquee-up var(--duration, 40s) linear infinite;
    }
</style>