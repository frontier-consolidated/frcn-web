<script lang="ts">
	import { config } from "$lib/config";

	export let sitename = config.name;
	export let title: string | undefined = undefined;
	export let description: string | undefined = undefined;
	export let image: string | undefined = undefined;
	export let titleSide: "left" | "right" = "left";
	export let imageSize: "small" | "large" = !image && config.meta.image ? "large" : "small";
	export let type: "website" | "article" = "website";

	let titleWithSiteName = title
		? titleSide === "left"
			? `${title} | ${sitename}`
			: `${sitename} | ${title}`
		: sitename;
	let descriptionOrDefault = description ? description : config.meta.description;
	let imageOrDefault = image ? image : (config.meta.image ?? config.meta.icon);
</script>

<svelte:head>
	<title>{titleWithSiteName}</title>
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
	{#if config.meta.twitter_handle}
		<meta name="twitter:creator" content={config.meta.twitter_handle} />
	{/if}
	<slot />
</svelte:head>
