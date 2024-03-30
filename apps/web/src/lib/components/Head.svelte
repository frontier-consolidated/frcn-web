<script lang="ts">
    import defaultImage from "$lib/images/logo.png"

    const siteName = "Frontier Consolidated"
    const defaultDescription = "The official website of the Frontier Consolidated Star Citizen community and org. The 'verse is dark and full of dangers, but you don't have to face the void alone. Come with us and explore the possibilities!"

    export let title: string | undefined = undefined;
    export let description: string | undefined = undefined;
    export let image: string | undefined = undefined;
    export let titleSide: "left" | "right" = "left"

    let titleWithSiteName = title ? (titleSide === "left" ? `${title} | ${siteName}` : `${siteName} | ${title}`) : siteName
    let descriptionOrDefault = description ? description : defaultDescription
    let imageOrDefault = image ? image : defaultImage
</script>

<svelte:head>
    <title>{titleWithSiteName}</title>
    <meta property="og:title" content={titleWithSiteName} />
    <meta name="description" content={descriptionOrDefault} />
    <meta property="og:description" content={descriptionOrDefault} />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={siteName} />
    <meta property="og:image" content={imageOrDefault} />
    <meta name="twitter:card" content="summary_large_image">
    <slot />
</svelte:head>