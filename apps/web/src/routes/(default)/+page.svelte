<script lang="ts">
	import { Button, Carousel, Gallery, Heading, type ImgType } from "flowbite-svelte";
	import { BookSolid, BuildingSolid, CalendarMonthSolid, DiscordSolid, UsersSolid } from "flowbite-svelte-icons";
	import type { HTMLImgAttributes } from "svelte/elements";
	import { twMerge } from "tailwind-merge";

	import Hr from "$lib/components/Hr.svelte";
	import { DISCORD_URL } from "$lib/constants";
	import image1 from "$lib/images/stock/carousel/1.png"
	import image2 from "$lib/images/stock/carousel/2.png"
	import image3 from "$lib/images/stock/carousel/3.png"
	import image4 from "$lib/images/stock/carousel/4.png"
	import activitiesImage from "$lib/images/stock/community/1.jpg"
	import orgImage from "$lib/images/stock/community/5.png"
	import communityImage from "$lib/images/stock/community.jpg"
	import gallery1 from "$lib/images/stock/gallery/1.jpg"
	import gallery10 from "$lib/images/stock/gallery/10.jpg"
	import gallery11 from "$lib/images/stock/gallery/11.jpg"
	import gallery12 from "$lib/images/stock/gallery/12.jpg"
	import gallery2 from "$lib/images/stock/gallery/2.jpg"
	import gallery3 from "$lib/images/stock/gallery/3.jpg"
	import gallery4 from "$lib/images/stock/gallery/4.jpg"
	import gallery5 from "$lib/images/stock/gallery/5.jpg"
	import gallery6 from "$lib/images/stock/gallery/6.jpg"
	import gallery7 from "$lib/images/stock/gallery/7.jpg"
	import gallery8 from "$lib/images/stock/gallery/8.jpg"
	import gallery9 from "$lib/images/stock/gallery/9.jpg"
	import knowledgeImage from "$lib/images/stock/knowledge.png"

	import HeroImg from "./about/HeroImg.svelte";
	import HeroTitle from "./about/HeroTitle.svelte";
	import PageCard from "./PageCard.svelte";

	const carouselImages: HTMLImgAttributes[] = [
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

	const galleryImages = [
		{
			src: gallery1,
			height: 40
		},
		{
			src: gallery2,
			height: 80
		},
		{
			src: gallery3,
			height: 52
		},
		{
			src: gallery4,
			height: 96
		},
		{
			src: gallery5,
			height: 44
		},
		{
			src: gallery6,
			height: 48
		},
		{
			src: gallery7,
			height: 96
		},
		{
			src: gallery8,
			height: 40
		},
		{
			src: gallery9,
			height: 64
		},
		{
			src: gallery10,
			height: 72
		},
		{
			src: gallery11,
			height: 48
		},
		{
			src: gallery12,
			height: 40
		}
	]
</script>

<svelte:head>
	<title>Frontier Consolidated</title>
	<meta name="description" content="Get involved with the latest community events" />
	<link rel="preload" href={activitiesImage} as="image" />
	<link rel="preload" href={communityImage} as="image" />
	<link rel="preload" href={orgImage} as="image" />
	<link rel="preload" href={knowledgeImage} as="image" />
</svelte:head>

<div class="grid min-[480px]:grid-cols-2 lg:grid-cols-4 mt-4 gap-4">
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
		src={activitiesImage}
		href="/about/activities"
	>
		<CalendarMonthSolid size="sm" class="me-2" /> Activities
	</PageCard>
	<PageCard
		src={knowledgeImage}
		href="/knowledge"
	>
		<BookSolid size="sm" class="me-2" /> Guides & Resources
	</PageCard>
</div>
<!-- <div class="mt-8">
	Must provide overrides for the sm, xl and 2xl breakpoints
	<Carousel images={carouselImages} duration={7000} class="h-72 sm:h-80 lg:h-96 xl:h-[28rem] 2xl:h-[28rem]" let:Controls let:Indicators>
		<Controls />
		<Indicators  />
	</Carousel>
</div> -->
<HeroImg 
	src={gallery7}
	class="mt-8"
	imgClass="rounded-lg object-cover w-full h-72 md:h-96 lg:h-[30rem]"
	captionClass="absolute rounded flex flex-col gap-3 m-8 p-6 max-w-[24rem] bg-black bg-opacity-70 text-white"
>
	<HeroTitle>Come join us!</HeroTitle>
	<p>
		The 'verse is dark and full of dangers, but you don't have to face the void alone.
	</p>
	<div class="flex-1 flex items-end justify-center">
		<Button size="lg" class="text-white bg-discord-500 dark:bg-discord-500 dark:hover:bg-discord-200" href={DISCORD_URL}>
			<DiscordSolid class="me-2" /> Join Our Discord
		</Button>
	</div>
</HeroImg>
<section class="mt-8">
	<Heading tag="h2" class="font-medium text-2xl">
		Gallery
	</Heading>
	<Hr class="my-4" />
	<div class="grid md:grid-cols-2 gap-4">
		<div class="grid gap-4">
			{#each galleryImages.slice(0, 6) as item}
				<div><img src={item.src} alt="" class={twMerge("w-full max-w-full rounded-lg object-cover", `h-${item.height}`)} /></div>
			{/each}
		</div>
		<div class="grid gap-4">
			{#each galleryImages.slice(6) as item}
				<div><img src={item.src} alt="" class={twMerge("w-full max-w-full rounded-lg object-cover", `h-${item.height}`)} /></div>
			{/each}
		</div>
	</div>
	<!-- <Gallery class="gap-2 grid-cols-2">
		<Gallery items={galleryImages.slice(0, 6)} class="" />
		<Gallery items={galleryImages.slice(6)} class="" />
	</Gallery> -->
</section>