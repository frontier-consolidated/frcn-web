<script lang="ts">
	import { CMSContainerType, type AboutSectionContainer } from "@frcn/cms";

	import CallToActionRenderer from "$lib/cms/CallToActionRenderer.svelte";
	import { Markdown } from "$lib/components";
    import placeholder from "$lib/images/stock/placeholder.jpg";

	import AboutSection from "./AboutSection.svelte";

	export let container: AboutSectionContainer;

    $: desktopImage = container.getDesktopImageFile();
    $: ctas = container.getChildrenOfType(CMSContainerType.CallToAction);
</script>

<AboutSection
    title={container.getTitle()}
    src={container.getDefaultImageFile()?.getSrc() ?? placeholder}
    sources={desktopImage ? {
        md: desktopImage.getSrc(),
    } : undefined}
    position={container.getPosition()}
>
    <Markdown nowrap source={container.getContent() ?? ""} disabled={["space"]} />
    {#if ctas.length > 0}
        <div class="flex-1 flex items-end justify-center">
            {#each ctas as cta}
                <CallToActionRenderer container={cta} />
            {/each}
        </div>
    {/if}
</AboutSection>