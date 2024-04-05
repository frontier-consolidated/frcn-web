<script lang="ts">
	import { CmsFile } from "@frcn/cms";
	import { Input, Label } from "flowbite-svelte";
	import { getContext } from "svelte";

	import { Field, FieldValidator } from "$lib/components";

    export let file: CmsFile;
    export let validator: FieldValidator;

    let editData = { identifier: file.getIdentifier() };
    $: {
        file.setIdentifier(editData.identifier);
        getContext<() => void>("containerchange")();
    }
</script>

<Field {validator} for="file-identifier-{file.id}" value={editData.identifier}>
    <Label for="file-identifier-{file.id}" class="mb-2">Identifier</Label>
    <Input
        class="rounded"
        id="file-identifier-{file.id}"
        name="file-identifier"
        type="text"
        placeholder="/"
        pattern="[A-Za-z]"
        maxlength="255"
        bind:value={editData.identifier}
    />
</Field>