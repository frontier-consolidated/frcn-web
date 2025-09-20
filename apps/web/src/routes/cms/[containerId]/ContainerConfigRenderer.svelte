<script lang="ts">
	import { CMSContainerType, type CmsContainer } from "@frcn/cms";
	import { Alert } from "flowbite-svelte";

	import type { FieldValidator } from "$lib/components";

	import AboutSectionContainerConfig from "./AboutSectionContainerConfig.svelte";
	import CtaContainerConfig from "./CtaContainerConfig.svelte";
	import GalleryContainerConfig from "./GalleryContainerConfig.svelte";
	import IndexContainerConfig from "./IndexContainerConfig.svelte";
	import SectionContainerConfig from "./SectionContainerConfig.svelte";

	export let validator: FieldValidator;
	export let container: CmsContainer;
	export let isChild: boolean = false;
</script>

{#if container.type === CMSContainerType.Index}
	<IndexContainerConfig {validator} {isChild} bind:container_={container} />
{:else if container.type === CMSContainerType.AboutSection}
	<AboutSectionContainerConfig {validator} {isChild} bind:container_={container} />
{:else if container.type === CMSContainerType.Section}
	<SectionContainerConfig {validator} {isChild} bind:container_={container} />
{:else if container.type === CMSContainerType.Gallery}
	<GalleryContainerConfig {validator} {isChild} bind:container_={container} />
{:else if container.type === CMSContainerType.CallToAction}
	<CtaContainerConfig {validator} {isChild} bind:container_={container} />
{:else}
	<Alert color="red">
		Container type '{container.type}' not implemented
	</Alert>
{/if}
