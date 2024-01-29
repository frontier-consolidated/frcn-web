<script lang="ts">
	import { Carousel } from "flowbite-svelte";
	import { BookSolid, BuildingSolid, CalendarMonthSolid, UsersSolid } from "flowbite-svelte-icons";
	import type { HTMLImgAttributes } from "svelte/elements";

	import image1 from "$lib/images/stock/carousel/1.png"
	import image2 from "$lib/images/stock/carousel/2.png"
	import image3 from "$lib/images/stock/carousel/3.png"
	import image4 from "$lib/images/stock/carousel/4.png"
	import activitiesImage from "$lib/images/stock/community/1.jpg"
	import orgImage from "$lib/images/stock/community/5.png"
	import communityImage from "$lib/images/stock/community.jpg"
	import knowledgeImage from "$lib/images/stock/knowledge.png"

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
	<link rel="preload" href={activitiesImage} as="image" />
	<link rel="preload" href={communityImage} as="image" />
	<link rel="preload" href={orgImage} as="image" />
	<link rel="preload" href={knowledgeImage} as="image" />
</svelte:head>

<div class="mt-8">
	<!-- Must provide overrides for the sm, xl and 2xl breakpoints -->
	<Carousel {images} duration={7000} class="h-72 sm:h-80 lg:h-96 xl:h-[28rem] 2xl:h-[28rem]" let:Controls let:Indicators>
		<Controls />
		<Indicators  />
	</Carousel>
</div>
<div class="grid min-[480px]:grid-cols-2 lg:grid-cols-4 mt-12 gap-4">
	<PageCard
		src={activitiesImage}
		href="/events"
	>
		<CalendarMonthSolid size="sm" class="me-2" /> Activities
	</PageCard>
	<PageCard
		src={communityImage}
		href="/about/community"
	>
		<UsersSolid size="sm" class="me-2" /> Community
	</PageCard>
	<PageCard
		src={orgImage}
		href="/about/org"
	>
		<BuildingSolid size="sm" class="me-2" /> Organisation
	</PageCard>
	<PageCard
		src={knowledgeImage}
		href="/knowledge"
	>
		<BookSolid size="sm" class="me-2" /> Guides & Resources
	</PageCard>
</div>