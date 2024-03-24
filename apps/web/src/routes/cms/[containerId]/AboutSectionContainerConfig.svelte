<script lang="ts">
	import { CMSContainerType, type AboutSectionContainer } from "@frcn/cms";
	import { Input, Label } from "flowbite-svelte";

	import { Field, FieldValidator, MarkdownEditor } from "$lib/components";

	import ContainerChildrenInput from "./ContainerChildrenInput.svelte";

    const validator = new FieldValidator()
    
    function createEditData(container: AboutSectionContainer) {
        return {
            identifier: container.getIdentifier(),
            title: container.getTitle(),
            content: container.getContent() ?? "",
        }
    }
    
    export let isChild: boolean = false;
    export let container: AboutSectionContainer;

    let editData = createEditData(container)
    $: {
        container.setIdentifier(editData.identifier)
        container.setTitle(editData.title)
        container.setContent(editData.content)
    }

</script>

{#if !isChild}
    <Field {validator} for="about-section-identifier-{container.id}" value={editData.identifier}>
        <Label for="about-section-identifier-{container.id}" class="mb-2">Identifier</Label>
        <Input
            class="rounded"
            id="about-section-identifier-{container.id}"
            name="about-section-identifier"
            type="text"
            placeholder="/"
            pattern="[A-Za-z]"
            maxlength="255"
            bind:value={editData.identifier}
        />
    </Field>
{/if}
<Field {validator} for="about-section-title-{container.id}" value={editData.title}>
    <Label for="about-section-title-{container.id}" class="mb-2">Title</Label>
    <Input
        class="rounded"
        id="about-section-title-{container.id}"
        name="about-section-title"
        type="text"
        placeholder="Title"
        pattern="[A-Za-z]"
        maxlength="255"
        bind:value={editData.title}
    />
</Field>
<Field {validator} for="about-section-content-{container.id}" value={editData.content}>
    <Label for="about-section-content-{container.id}" class="mb-2">Content</Label>
    <MarkdownEditor
        placeholder="Content"
        bind:value={editData.content}
    />
</Field>
<div>
    <Label class="mb-2">CTAs</Label>
    <ContainerChildrenInput {container} addName="Add CTA" allowedChildren={[CMSContainerType.CallToAction]} />
</div>