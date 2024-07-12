<script lang="ts">
    import defaultImage from "$lib/images/logo.png";

    const site_name = "Frontier Consolidated";
    const description_prefix = "The official website of the Frontier Consolidated Star Citizen community and organisation.\n";
    const default_description = "The 'verse is dark and full of dangers, but you don't have to face the void alone. Come with us and explore the possibilities!";

    export let title: string | undefined = undefined;
    export let description: string | undefined = undefined;
    export let image: string | undefined = undefined;
    export let titleSide: "left" | "right" = "left";
    export let imageSize: "small" | "large" = "small";

    let title_with_site_name = title ? (titleSide === "left" ? `${title} | ${site_name}` : `${site_name} | ${title}`) : site_name;
    let description_or_default = description_prefix + (description ? description : default_description);
    let image_or_default = image ? image : defaultImage;
</script>

<svelte:head>
    <title>{title_with_site_name}</title>
    <meta property="og:title" content={title_with_site_name} />
    <meta name="description" content={description_or_default} />
    <meta property="og:description" content={description_or_default} />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={site_name} />
    <meta property="og:image" content={image_or_default} />
    {#if imageSize === "large"}
        <meta name="twitter:card" content="summary_large_image">
    {/if}
    <slot />
</svelte:head>