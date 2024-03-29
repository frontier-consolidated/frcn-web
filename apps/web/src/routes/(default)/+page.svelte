<script lang="ts">
	import { Button, Heading } from "flowbite-svelte";
	import { BookSolid, BuildingSolid, DiscordSolid, MapPinAltSolid, UsersSolid } from "flowbite-svelte-icons";
	import { twMerge } from "tailwind-merge";

	import Hr from "$lib/components/Hr.svelte";
	import { DISCORD_URL } from "$lib/constants";
	import activitiesImage from "$lib/images/stock/activities.png"
	import communityImage from "$lib/images/stock/community.jpg"
	import joinusImage from "$lib/images/stock/joinus.jpg"
	import knowledgeImage from "$lib/images/stock/knowledge.png"
	import orgImage from "$lib/images/stock/org.png"

	import HeroImg from "./about/HeroImg.svelte";
	import HeroTitle from "./about/HeroTitle.svelte";
	import { galleryImages } from "./galleryImages";
	import PageCard from "./PageCard.svelte";

</script>

<svelte:head>
	<title>Frontier Consolidated</title>
	<meta name="description" content="Get involved with the latest community events" />
	<link rel="preload" href={activitiesImage} as="image" />
	<link rel="preload" href={communityImage} as="image" />
	<link rel="preload" href={orgImage} as="image" />
	<link rel="preload" href={knowledgeImage} as="image" />
	{#each galleryImages as image}
		<link rel="preload" href={image.src} as="image" />
	{/each}
</svelte:head>

<HeroImg 
	src={joinusImage}
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
			<DiscordSolid class="me-2" tabindex="-1" /> Join our Discord
		</Button>
	</div>
</HeroImg>
<div class="grid min-[480px]:grid-cols-2 lg:grid-cols-4 mt-8 gap-4">
	<PageCard
		src={communityImage}
		href="/about/community"
		>
		<UsersSolid size="sm" class="me-2" tabindex="-1" /> Community
	</PageCard>
	<PageCard
		src={orgImage}
		href="/about/org"
	>
		<BuildingSolid size="sm" class="me-2" tabindex="-1" /> Organisation
	</PageCard>
	<PageCard
		src={activitiesImage}
		href="/about/activities"
	>
		<MapPinAltSolid size="sm" class="me-2" tabindex="-1" /> Activities
	</PageCard>
	<PageCard
		src={knowledgeImage}
		href="/knowledge"
	>
		<BookSolid size="sm" class="me-2" tabindex="-1" /> Guides & Resources
	</PageCard>
</div>
<section class="mt-32">
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
</section>