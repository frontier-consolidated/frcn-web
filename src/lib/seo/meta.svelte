<script lang="ts">
	import type { Snippet } from "svelte";

	import { config } from "$lib/config";

	let {
		sitename = config.name,
		title,
		description,
		favicon = "/favicon.png",
		image,
		titleSide = "left",
		imageSize = !image && config.meta.image ? "large" : "small",
		type = "website",
		children
	}: {
		sitename?: string;
		title?: string;
		description?: string;
		favicon?: string;
		image?: string;
		titleSide?: "left" | "right";
		imageSize?: "small" | "large";
		type?: "website" | "article";
		children?: Snippet;
	} = $props();

	const titleWithSiteName = $derived(
		title ? (titleSide === "left" ? `${title} | ${sitename}` : `${sitename} | ${title}`) : sitename
	);
	const descriptionOrDefault = $derived(description ? description : config.meta.description);
	const imageOrDefault = $derived(image ? image : (config.meta.image ?? config.meta.icon));
</script>

<svelte:head>
	<title>{titleWithSiteName}</title>
	{#if favicon}
		<link rel="icon" href={favicon} />
	{/if}
	<meta name="application-name" content={sitename} />
	<meta name="theme-color" content={config.meta.color} />
	<meta name="msapplication-TileColor" content={config.meta.color} />
	<meta name="msapplication-TileImage" content={config.meta.icon} />
	<meta name="description" content={descriptionOrDefault} />
	<meta name="keywords" content={config.meta.keywords.join(", ")} />
	<meta property="og:title" content={titleWithSiteName} />
	<meta property="og:description" content={descriptionOrDefault} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={sitename} />
	<meta property="og:image" content={imageOrDefault} />
	{#if imageSize === "large"}
		<meta name="twitter:card" content="summary_large_image" />
	{/if}
	{#if config.meta.twitterHandle}
		<meta name="twitter:creator" content={config.meta.twitterHandle} />
	{/if}
	{#if children}
		{@render children()}
	{/if}
</svelte:head>
