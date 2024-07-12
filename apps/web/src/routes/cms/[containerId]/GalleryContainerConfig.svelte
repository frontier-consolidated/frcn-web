<script lang="ts">
	import { CmsContainer, GalleryContainer } from "@frcn/cms";
	import { Input, Label } from "flowbite-svelte";
	import { getContext } from "svelte";

	import { Field, FieldValidator } from "$lib/components";

	import ContainerFilesInput from "./ContainerFilesInput.svelte";
    
    function create_edit_data(container: GalleryContainer) {
        return {
            identifier: container.getIdentifier(),
        };
    }
    
    export let container_: CmsContainer;
    export let validator: FieldValidator;
    export let isChild: boolean = false;

    let container = container_.as<GalleryContainer>();
    $: container = container_.as<GalleryContainer>();

    let edit_data = create_edit_data(container);
    $: {
        container.setIdentifier(edit_data.identifier);
        getContext<() => void>("containerchange")();
    }
</script>

<Field {validator} for="section-identifier-{container.id}" value={edit_data.identifier} required={!isChild}>
    <Label for="section-identifier-{container.id}" class="mb-2">Identifier</Label>
    <Input
        class="rounded"
        id="section-identifier-{container.id}"
        name="section-identifier"
        type="text"
        placeholder="/"
        pattern="[A-Za-z]"
        maxlength="255"
        bind:value={edit_data.identifier}
    />
</Field>
<div>
    <Label class="mb-2">Images</Label>
    <ContainerFilesInput {validator} {container} />
</div>