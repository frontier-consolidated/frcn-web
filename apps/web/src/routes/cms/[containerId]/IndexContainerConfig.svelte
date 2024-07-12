<script lang="ts">
	import type { CmsContainer, IndexContainer } from "@frcn/cms";
	import { Input, Label } from "flowbite-svelte";
	import { getContext } from "svelte";

	import { Field, FieldValidator } from "$lib/components";

	import ContainerChildrenInput from "./ContainerChildrenInput.svelte";
    
    function create_edit_data(container: IndexContainer) {
        return {
            identifier: container.getIdentifier(),
            title: container.getTitle(),
            subTitle: container.getSubTitle(),
            metaTitle: container.getMetaTitle(),
            metaDescription: container.getMetaDescription()
        };
    }
    
    export let container_: CmsContainer;
    export let validator: FieldValidator;
    export let isChild: boolean = false;

    let container = container_.as<IndexContainer>();
    $: container = container_.as<IndexContainer>();

    let edit_data = create_edit_data(container);
    $: {
        container.setIdentifier(edit_data.identifier);
        container.setTitle(edit_data.title);
        container.setSubTitle(edit_data.subTitle);
        container.setMetaTitle(edit_data.metaTitle);
        container.setMetaDescription(edit_data.metaDescription);
        getContext<() => void>("containerchange")();
    }

</script>

<Field {validator} for="index-identifier-{container.id}" value={edit_data.identifier} required={!isChild}>
    <Label for="index-identifier-{container.id}" class="mb-2">Identifier</Label>
    <Input
        class="rounded"
        id="index-identifier-{container.id}"
        name="index-identifier"
        type="text"
        placeholder="/"
        pattern="[A-Za-z]"
        maxlength="255"
        bind:value={edit_data.identifier}
    />
</Field>
<Field {validator} for="index-title-{container.id}" value={edit_data.title}>
    <Label for="index-title-{container.id}" class="mb-2">Title</Label>
    <Input
        class="rounded"
        id="index-title-{container.id}"
        name="index-title"
        type="text"
        placeholder="Title"
        pattern="[A-Za-z]"
        maxlength="255"
        bind:value={edit_data.title}
    />
</Field>
<Field {validator} for="index-sub-title-{container.id}" value={edit_data.subTitle}>
    <Label for="index-sub-title-{container.id}" class="mb-2">Sub Title</Label>
    <Input
        class="rounded"
        id="index-sub-title-{container.id}"
        name="index-sub-title"
        type="text"
        placeholder="Sub title"
        pattern="[A-Za-z]"
        maxlength="255"
        bind:value={edit_data.subTitle}
    />
</Field>
<Field {validator} for="index-meta-title-{container.id}" value={edit_data.metaTitle}>
    <Label for="index-meta-title-{container.id}" class="mb-2">Meta Title</Label>
    <Input
        class="rounded"
        id="index-meta-title-{container.id}"
        name="index-meta-title"
        type="text"
        placeholder="Meta title"
        pattern="[A-Za-z]"
        maxlength="255"
        bind:value={edit_data.metaTitle}
    />
</Field>
<Field {validator} for="index-meta-description-{container.id}" value={edit_data.metaDescription}>
    <Label for="index-meta-description-{container.id}" class="mb-2">Meta Description</Label>
    <Input
        class="rounded"
        id="index-meta-description-{container.id}"
        name="index-meta-description"
        type="text"
        placeholder="Meta description"
        pattern="[A-Za-z]"
        maxlength="255"
        bind:value={edit_data.metaDescription}
    />
</Field>
<div>
    <Label class="mb-2">Sections</Label>
    <ContainerChildrenInput {validator} {container} addName="Add Section" allowedChildren={container.getAllowedChildren()} />
</div>