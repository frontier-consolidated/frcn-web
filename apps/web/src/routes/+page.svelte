<script lang="ts">
	import { CMSContainerType, SectionContainer, type IndexContainer } from "@frcn/cms";
	import { Heading } from "flowbite-svelte";
	import { BookSolid, BuildingSolid, MapPinAltSolid, UsersSolid } from "flowbite-svelte-icons";

	import CallToActionRenderer from "$lib/cms/CallToActionRenderer.svelte";
	import { transformContainer } from "$lib/cms/transformContainer";
	import { Head, Hr, Markdown } from "$lib/components";
	import logo from "$lib/images/logo.png";
	import activitiesImage from "$lib/images/stock/activities.png?w=580&imagetools";
	import communityImage from "$lib/images/stock/community.png?w=580&imagetools";
	import metaImage from "$lib/images/stock/hero.png?w=1200&format=webp&imagetools";
	import heroImageSrcset from "$lib/images/stock/hero.png?w=500;900;1200;1600;2000&format=webp&as=srcset&imagetools";
	import orgImage from "$lib/images/stock/org.png?w=580&imagetools";
	import placeholder from "$lib/images/stock/placeholder.jpg";
	import resourcesImage from "$lib/images/stock/resources.png?w=580&imagetools";

	import type { PageData } from "./$types";

	export let data: PageData;
	$: index = data.index ? transformContainer<IndexContainer>(data.index) : null;
	$: welcomeSection = index?.findFirstChild("welcome")?.as<SectionContainer>();
	$: welcomeCtas = welcomeSection?.getChildrenOfType(CMSContainerType.CallToAction) ?? [];
	$: galleryImages =
		index
			?.findFirstChildOfType(CMSContainerType.Gallery)
			?.getFiles()
			.map((f) => f.getSrc())
			.filter((src): src is string => !!src) ?? [];

	const pageCards = [
		{ src: communityImage, name: "COMMUNITY", href: "/about/community", icon: UsersSolid },
		{ src: orgImage, name: "ORGANISATION", href: "/about/org", icon: BuildingSolid },
		{
			src: activitiesImage,
			name: "ACTIVITES",
			href: "/about/activities",
			icon: MapPinAltSolid
		},
		{ src: resourcesImage, name: "GUIDES & RESOURCES", href: "/resources", icon: BookSolid }
	];

	const partners = [
		// {
		// 	src: "https://www.teamspeak.com/user/themes/teamspeak/images/logo_inverse.svg",
		// 	href: "https://www.teamspeak.com/",
		// 	alt: "Teamspeak"
		// },
		// {
		// 	src: "https://robertsspaceindustries.com/media/6wlp3kdl35hz6r/logo/ANZIA-Logo.png",
		// 	href: "https://anziaracing.com/",
		// 	alt: "ANZIA Racing"
		// }
	];
</script>

<Head
	title={index?.getMetaTitle()}
	titleSide="right"
	description={index?.getMetaDescription()}
	image={metaImage}
	imageSize="large"
>
	<link rel="preload" imagesrcset={heroImageSrcset} imagesizes="100vw" as="image" />
	{#each galleryImages as image}
		<link rel="preload" href={image} as="image" />
	{/each}
</Head>

<div class="relative">
	<img
		srcset={heroImageSrcset}
		alt="index hero"
		class="h-[50vh] min-h-[25rem] w-full bg-slate-950 object-cover brightness-90"
	/>
	<div class="absolute left-0 top-0 flex h-full w-full items-center justify-center gap-12">
		<div class="flex items-center px-4 sm:px-0">
			<img
				src={logo}
				class="mr-4 h-16 drop-shadow-md sm:h-24 md:h-32"
				alt="Frontier Consolidated logo"
			/>
			<div class="w-px self-stretch bg-gray-300 drop-shadow-md"></div>
			<h1
				class="ml-6 text-2xl font-medium text-white drop-shadow-md min-[460px]:text-3xl sm:ml-12 sm:text-4xl md:text-5xl"
			>
				Frontier Consolidated
			</h1>
		</div>
	</div>
</div>
<section
	class="border-primary-400 dark:border-primary-600 relative border-y bg-neutral-200 p-4 pt-0 dark:bg-gray-900"
>
	<div class="mx-auto -mt-10 grid max-w-7xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
		{#each pageCards as card}
			<a href={card.href} class="group/card clip-tr-8 relative rounded">
				<figure class="h-36 cursor-pointer min-[480px]:h-48 sm:h-60">
					<img
						class="clip-tr-8 h-full w-full rounded object-cover transition-[filter] group-hover/card:grayscale"
						src={card.src}
						alt={card.name}
					/>
					<figcaption
						class="text-md absolute bottom-0 left-0 flex w-full items-center rounded-b bg-white/50 p-2 font-semibold text-gray-900 backdrop-blur-lg sm:p-4 dark:bg-black/30 dark:text-white"
					>
						<svelte:component this={card.icon} size="sm" class="me-2" tabindex="-1" />
						{card.name}
					</figcaption>
				</figure>
			</a>
		{/each}
	</div>
	<div
		class="clip-br-parallel-8 bg-primary-400 dark:bg-primary-600 absolute -bottom-[2rem] left-0 h-8 w-[20%]"
	></div>
	<div
		class="clip-bl-parallel-8 bg-primary-400 dark:bg-primary-600 absolute -bottom-[2rem] right-0 h-8 w-[20%]"
	></div>
	<div
		class="clip-br-parallel-8 absolute -bottom-[calc(2rem-1px)] left-0 h-8 w-[calc(20%-1px)] bg-neutral-200 dark:bg-gray-900"
	></div>
	<div
		class="clip-bl-parallel-8 absolute -bottom-[calc(2rem-1px)] right-0 h-8 w-[calc(20%-1px)] bg-neutral-200 dark:bg-gray-900"
	></div>
</section>
<section class="bg-triangle-pattern w-full bg-white px-4 py-16 dark:bg-slate-950">
	<div class="mx-auto flex w-full max-w-5xl flex-col gap-2 md:flex-row md:gap-8">
		<div
			class="clip-tl-br-12 h-[500px] w-full shrink-0 overflow-hidden rounded p-px md:w-[350px] md:self-stretch lg:w-[400px] dark:bg-gray-700"
		>
			<img
				src={welcomeSection?.getFiles()[0]?.getSrc() ?? placeholder}
				alt="welcome to the frontier"
				class="clip-tl-br-12 h-full w-full object-cover"
			/>
		</div>
		<div class="flex flex-col self-stretch p-6">
			<h2 class="text-3xl font-semibold text-black lg:text-4xl dark:text-white">
				<span class="text-primary-700 dark:text-primary-500 me-4">///</span>
				{welcomeSection?.getTitle() ?? ""}
			</h2>
			<div class="mt-6 flex flex-col gap-4 text-lg text-gray-800 dark:text-gray-300">
				<Markdown nowrap source={welcomeSection?.getContent() ?? ""} disabled={["space"]} />
			</div>
			{#if welcomeCtas.length > 0}
				<div class="flex w-full flex-1 items-center justify-center gap-4 pt-12">
					{#each welcomeCtas as cta}
						<CallToActionRenderer container={cta} />
					{/each}
				</div>
			{/if}
		</div>
	</div>
</section>
{#if partners.length}
	<section
		class="border-primary-400 dark:border-primary-600 border-y bg-slate-300 py-8 dark:bg-gray-900"
	>
		<!-- <h2 class="text-center text-3xl font-medium text-primary-600 dark:text-gray-300">Our Partners</h2>
		<Marquee fade class="mt-8">
			{#each partners as partner}
				<a href={partner.href} class="shrink-0 rounded-lg h-32 w-32">
					<img src={partner.src} alt={partner.alt} class="w-full h-full object-contain" />
				</a>
			{/each}
		</Marquee> -->
	</section>
{/if}
<div class="mx-auto mt-24 flex w-full max-w-5xl flex-col gap-24 p-4 pt-0">
	<section>
		<Heading tag="h2" class="text-2xl font-medium">
			<span class="text-primary-700 dark:text-primary-500 me-4">///</span> Gallery
		</Heading>
		<Hr class="bg-primary-300 dark:bg-primary-600 my-4" />
		<div class="grid gap-4 md:grid-cols-2">
			<div class="grid h-min gap-4">
				{#each galleryImages.slice(0, Math.ceil(galleryImages.length / 2)) as image}
					<div class="clip-tr-8 rounded bg-gray-400 p-px dark:bg-gray-800">
						<img src={image} alt="" class="clip-tr-8 w-full max-w-full rounded object-cover" />
					</div>
				{/each}
			</div>
			<div class="grid h-min gap-4">
				{#each galleryImages.slice(Math.ceil(galleryImages.length / 2)) as image}
					<div class="clip-tr-8 rounded bg-gray-400 p-px dark:bg-gray-800">
						<img src={image} alt="" class="clip-tr-8 w-full max-w-full rounded object-cover" />
					</div>
				{/each}
			</div>
		</div>
	</section>
</div>
