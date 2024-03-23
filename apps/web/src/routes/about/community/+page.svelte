<script lang="ts">
	import { CMSContainerType } from "@frcn/cms";
	import { Heading } from "flowbite-svelte";

	import heroImageSrcset from "$lib/images/stock/community/hero.png?w=500;900;1200;1600;2000&format=webp&as=srcset&imagetools"

	import type { PageData } from "./$types";
	import AboutHero from "../AboutHero.svelte";
	import CmsAboutSectionRenderer from "../CmsAboutSectionRenderer.svelte";

	export let data: PageData;
</script>

<svelte:head>
	<title>Our Community - About | Frontier Consolidated</title>
</svelte:head>

<AboutHero srcset={heroImageSrcset}>
	<Heading tag="h1" class="text-white font-medium text-4xl sm:text-5xl drop-shadow-md">{data.index.getTitle()}</Heading>
	<p class="text-slate-400 drop-shadow-md">{data.index.getSubTitle()}</p>
</AboutHero>
<section class="mt-2 flex flex-col gap-8 p-4 w-full max-w-6xl mx-auto">
	{#each data.index.getChildrenOfType(CMSContainerType.AboutSection) as section}
		<CmsAboutSectionRenderer container={section} />
	{/each}
</section>