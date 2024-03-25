<script lang="ts">
	import type { CmsContainer, IndexContainer } from "@frcn/cms";
	import { Input, Label } from "flowbite-svelte";
	import { getContext } from "svelte";

	import { Field, FieldValidator } from "$lib/components";

	import ContainerChildrenInput from "./ContainerChildrenInput.svelte";
    
    function createEditData(container: IndexContainer) {
        return {
            identifier: container.getIdentifier(),
            title: container.getTitle(),
            subTitle: container.getSubTitle()
        }
    }
    
    export let container_: CmsContainer;
    export let validator: FieldValidator;
    export let isChild: boolean = false;

    let container = container_.as<IndexContainer>()
    $: container = container_.as<IndexContainer>()

    let editData = createEditData(container)
    $: {
        container.setIdentifier(editData.identifier)
        container.setTitle(editData.title)
        container.setSubTitle(editData.subTitle)
        getContext<() => void>("containerchange")()
    }

</script>

{#if !isChild}
    <Field {validator} for="index-identifier-{container.id}" value={editData.identifier}>
        <Label for="index-identifier-{container.id}" class="mb-2">Identifier</Label>
        <Input
            class="rounded"
            id="index-identifier-{container.id}"
            name="index-identifier"
            type="text"
            placeholder="/"
            pattern="[A-Za-z]"
            maxlength="255"
            bind:value={editData.identifier}
        />
    </Field>
{/if}
<Field {validator} for="index-title-{container.id}" value={editData.title}>
    <Label for="index-title-{container.id}" class="mb-2">Title</Label>
    <Input
        class="rounded"
        id="index-title-{container.id}"
        name="index-title"
        type="text"
        placeholder="Title"
        pattern="[A-Za-z]"
        maxlength="255"
        bind:value={editData.title}
    />
</Field>
<Field {validator} for="index-sub-title-{container.id}" value={editData.subTitle}>
    <Label for="index-sub-title-{container.id}" class="mb-2">Sub Title</Label>
    <Input
        class="rounded"
        id="index-sub-title-{container.id}"
        name="index-sub-title"
        type="text"
        placeholder="Sub title"
        pattern="[A-Za-z]"
        maxlength="255"
        bind:value={editData.subTitle}
    />
</Field>
<div>
    <Label class="mb-2">Sections</Label>
    <ContainerChildrenInput {validator} {container} addName="Add Section" allowedChildren={container.getAllowedChildren()} />
</div>