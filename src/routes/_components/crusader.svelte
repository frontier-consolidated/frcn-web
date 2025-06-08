<script lang="ts">
	import { onMount } from "svelte";

	import { createDashAnimation } from "$lib/state/dashAnimation.svelte";

	import crusaderImage from "../_assets/crusader.png";

	let dashAnimation = createDashAnimation(8);

	onMount(() => {
		dashAnimation.start();
		return () => {
			dashAnimation.stop();
		};
	});
</script>

<div
	class="absolute top-[calc((64rem-100vw)*0.2)] left-0 sm:top-[calc((64rem-100vw)*0.2+2rem)] lg:top-8 lg:-translate-x-1/2"
>
	<div
		class="from-background absolute top-0 left-0 aspect-square w-[94%] bg-radial from-60% to-transparent to-75%"
	></div>
	<svg
		class="mask-ring absolute right-1/2 bottom-3/7 w-[91%] translate-x-1/2 translate-y-1/2 brightness-40 lg:brightness-100"
		width="1467"
		height="1243"
		viewBox="0 0 1467 1243"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M665.249 129.753C263.045 337.816 -32.4541 726.646 5.24069 998.231C42.9249 1269.81 399.545 1321.31 801.748 1113.25C1203.96 905.184 1499.45 516.354 1461.76 244.769C1424.07 -26.8147 1067.46 -78.3095 665.249 129.753Z"
			stroke="white"
			stroke-width="3"
			stroke-dasharray="8 8"
			stroke-dashoffset={dashAnimation.dashoffset}
		/>
	</svg>
	<img
		src={crusaderImage}
		width="1619"
		height="1619"
		alt="Crusader"
		class="mask-planet relative size-[94%] brightness-40 lg:brightness-100"
	/>
	<div class="absolute right-[10%] bottom-0 h-1/2 w-1/2 overflow-hidden">
		<svg
			class="absolute right-[80%] bottom-6/7 w-[182%] translate-x-1/2 translate-y-1/2 brightness-40 lg:brightness-100"
			width="1467"
			height="1243"
			viewBox="0 0 1467 1243"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M665.249 129.753C263.045 337.816 -32.4541 726.646 5.24069 998.231C42.9249 1269.81 399.545 1321.31 801.748 1113.25C1203.96 905.184 1499.45 516.354 1461.76 244.769C1424.07 -26.8147 1067.46 -78.3095 665.249 129.753Z"
				stroke="white"
				stroke-width="3"
				stroke-dasharray="8 8"
				stroke-dashoffset={dashAnimation.dashoffset}
			/>
		</svg>
	</div>
</div>

<style lang="postcss">
	@media (min-width: 108rem) {
		.mask-planet {
			mask-image: radial-gradient(circle at right center, white 50%, transparent 70%);
		}

		.mask-ring {
			mask-image: radial-gradient(circle at 40% 40%, transparent 55%, white 60%);
		}
	}
</style>
