<script lang="ts">
	import { CallToActionPreset, type CtaContainer } from "@frcn/cms";
	import { Input, Label } from "flowbite-svelte";

	import { Field, FieldValidator, Select } from "$lib/components";

    const presetOptions = Object.values(CallToActionPreset).filter(val => typeof val !== "string").map(preset => ({
        name: CallToActionPreset[preset as CallToActionPreset],
        value: preset
    }))

    const validator = new FieldValidator()
    
    function createEditData(container: CtaContainer) {
        return {
            identifier: container.getIdentifier(),
            text: container.getTitle(),
            preset: container.getPreset() ?? CallToActionPreset.None,
        }
    }
    
    export let isChild: boolean = false;
    export let container: CtaContainer;

    let editData = createEditData(container)
    $: {
        container.setIdentifier(editData.identifier)
        container.setTitle(editData.text)
        container.setPreset(editData.preset)
    }
</script>

{#if !isChild}
    <Field {validator} for="cta-identifier-{container.id}" value={editData.identifier}>
        <Label for="cta-identifier-{container.id}" class="mb-2">Identifier</Label>
        <Input
            class="rounded"
            id="cta-identifier-{container.id}"
            name="cta-identifier"
            type="text"
            placeholder="/"
            pattern="[A-Za-z]"
            maxlength="255"
            bind:value={editData.identifier}
        />
    </Field>
{/if}
<Field {validator} for="cta-preset-{container.id}" value={editData.preset}>
    <Label for="cta-preset-{container.id}" class="mb-2">Preset</Label>
    <Select
        id="cta-preset-{container.id}"
        name="cta-preset"
        options={presetOptions}
        required
        bind:value={editData.preset}
    />
</Field>
{#if editData.preset === CallToActionPreset.None}
    <Field {validator} for="cta-text-{container.id}" value={editData.text}>
        <Label for="cta-text-{container.id}" class="mb-2">Text</Label>
        <Input
            class="rounded"
            id="cta-text-{container.id}"
            name="cta-text"
            type="text"
            placeholder="Title"
            pattern="[A-Za-z]"
            maxlength="255"
            bind:value={editData.text}
        />
    </Field>
{/if}