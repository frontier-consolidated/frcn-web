<script lang="ts">
	import { Carousel } from "flowbite-svelte";
	import type { HTMLImgAttributes } from "svelte/elements";

	import calendarImage from "$lib/images/stock/calendar.png"
	import image1 from "$lib/images/stock/carousel/1.png"
	import image2 from "$lib/images/stock/carousel/2.png"
	import image3 from "$lib/images/stock/carousel/3.png"
	import image4 from "$lib/images/stock/carousel/4.png"
	import eventsImage from "$lib/images/stock/events.png"

	import PageCard from "./PageCard.svelte";

	const images: HTMLImgAttributes[] = [
		{
			src: image1,
		},
		{
			src: image2,
		},
		{
			src: image3,
		},
		{
			src: image4,
		}
	]
</script>

<svelte:head>
	<title>Frontier Consolidated Events</title>
	<meta name="description" content="Get involved with the latest community events" />
	<link rel="preload" href={eventsImage} as="image" />
</svelte:head>

<Carousel {images} duration={7000} class="h-72 sm:h-80 md:h-96" let:Controls let:Indicators>
	<Controls />
	<Indicators  />
</Carousel>
<div class="grid min-[450px]:grid-cols-2 mt-4 gap-4">
	<PageCard
		src={eventsImage}
		alt="Group of players gathered in a circle"
		href="/events"
		caption="Upcoming Events"
	/>
	<PageCard
		src={calendarImage}
		alt="A ship flying over a planet towards the sun"
		href="/events#calendar"
		caption="Events Calendar"
	/>
</div>