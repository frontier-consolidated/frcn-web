<script lang="ts">
	import { Button, Heading } from "flowbite-svelte";
	import { BookSolid, BuildingSolid, CalendarMonthSolid, DiscordSolid, UsersSolid } from "flowbite-svelte-icons";
	import { twMerge } from "tailwind-merge";

	import Hr from "$lib/components/Hr.svelte";
	import { DISCORD_URL } from "$lib/constants";
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

<HeroImg 
	src={gallery7}
	class="mt-4"
	imgClass="rounded-t-lg sm:rounded-lg object-cover w-full h-72 sm:h-96 md:h-96 lg:h-[30rem]"
	captionClass="sm:absolute rounded-b-lg sm:rounded flex flex-col gap-3 sm:m-8 p-6 sm:max-w-[24rem] bg-gray-800 sm:bg-black sm:bg-opacity-70 text-white"
>
	<HeroTitle>Welcome to the Frontier!</HeroTitle>
	<p>
		Frontier Consolidated is a growing Star Citizen organisation and we want to bring the joy of multiplayer action to as many people as we can.
	</p>
	<p>
		Check out our community and org pages to see what we're about and come say hi over on Discord if you want to get involved.
	</p>
	<div class="flex-1 flex items-end justify-center">
		<Button size="lg" class="text-white bg-discord-500 dark:bg-discord-500 dark:hover:bg-discord-200" href={DISCORD_URL}>
			<DiscordSolid class="me-2" /> Join Our Discord
		</Button>
	</div>
</HeroImg>
<div class="grid min-[480px]:grid-cols-2 lg:grid-cols-4 mt-8 gap-4">
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