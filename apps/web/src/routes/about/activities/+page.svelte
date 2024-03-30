<script lang="ts">
	import { CMSContainerType, IndexContainer } from "@frcn/cms";
	import { Heading } from "flowbite-svelte";

	import { transformContainer } from "$lib/cms/transformContainer";
	import { Head, PageHero } from "$lib/components";
	import metaImage from "$lib/images/stock/activities-hero.jpg?w=1200&format=webp&imagetools"
	import heroImageSrcset from "$lib/images/stock/activities-hero.jpg?w=500;900;1200;1600;2000&format=webp&as=srcset&imagetools"

	import type { PageData } from "./$types";
	import CmsAboutSectionRenderer from "../CmsAboutSectionRenderer.svelte";

	export let data: PageData;
	$: index = data.index ? transformContainer<IndexContainer>(data.index) : null
</script>

<Head 
	title={index?.getMetaTitle() ? index?.getMetaTitle() : "Our Activities - About"}
	description={index?.getMetaDescription()}
	image={metaImage}
>
	<link rel="preload" imagesrcset={heroImageSrcset} imagesizes="100vw" as="image" />
</Head>

<PageHero srcset={heroImageSrcset}>
	<Heading tag="h1" class="text-white font-medium text-4xl sm:text-5xl drop-shadow-md">{index?.getTitle() ? index?.getTitle() : "Frontier Activities"}</Heading>
	<p class="text-slate-400 drop-shadow-md">{index?.getSubTitle() ? index?.getSubTitle() : ""}</p>
</PageHero>
<section class="mt-2 flex flex-col gap-8 p-4 w-full max-w-6xl mx-auto">
	{#if index}
		{#each index.getChildrenOfType(CMSContainerType.AboutSection) as section}
			<CmsAboutSectionRenderer container={section} />
		{/each}
	{/if}
</section>