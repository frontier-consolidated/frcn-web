<script lang="ts">
	import { CMSContainerType, type CmsContainer, type ContainerInstanceTypeMap } from "@frcn/cms";
	import { Alert } from "flowbite-svelte";

    import AboutSectionContainerConfig from "./AboutSectionContainerConfig.svelte";
	import CtaContainerConfig from "./CtaContainerConfig.svelte";
	import IndexContainerConfig from "./IndexContainerConfig.svelte";

    function containerAs<T extends CMSContainerType>(container: CmsContainer, _type: T) {
        return container as T extends keyof ContainerInstanceTypeMap ? ContainerInstanceTypeMap[T] : CmsContainer
    }
    
    export let isChild: boolean = false;
    export let container: CmsContainer
</script>

{#if container.type === CMSContainerType.Index}
    <IndexContainerConfig container={containerAs(container, CMSContainerType.Index)} {isChild} />
{:else if container.type === CMSContainerType.AboutSection}
    <AboutSectionContainerConfig container={containerAs(container, CMSContainerType.AboutSection)} {isChild} />
{:else if container.type === CMSContainerType.CallToAction}
    <CtaContainerConfig container={containerAs(container, CMSContainerType.CallToAction)} {isChild} />
{:else}
    <Alert color="red">
        Container type '{container.type}' not implemented
    </Alert>
{/if}