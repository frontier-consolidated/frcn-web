<script lang="ts">
	import { CmsContainer, GalleryContainer } from "@frcn/cms";
	import { Input, Label } from "flowbite-svelte";
	import { getContext } from "svelte";

	import { Field, FieldValidator } from "$lib/components";

	import ContainerFilesInput from "./ContainerFilesInput.svelte";
    
    function createEditData(container: GalleryContainer) {
        return {
            identifier: container.getIdentifier(),
        };
    }
    
    export let container_: CmsContainer;
    export let validator: FieldValidator;
    export let isChild: boolean = false;

    let container = container_.as<GalleryContainer>();
    $: container = container_.as<GalleryContainer>();

    let editData = createEditData(container);
    $: {
        container.setIdentifier(editData.identifier);
        getContext<() => void>("containerchange")();
    }
</script>

<Field {validator} for="section-identifier-{container.id}" value={editData.identifier} required={!isChild}>
    <Label for="section-identifier-{container.id}" class="mb-2">Identifier</Label>
    <Input
        class="rounded"
        id="section-identifier-{container.id}"
        name="section-identifier"
        type="text"
        placeholder="/"
        pattern="[A-Za-z]"
        maxlength="255"
        bind:value={editData.identifier}
    />
</Field>
<div>
    <Label class="mb-2">Images</Label>
    <ContainerFilesInput {validator} {container} />
</div>