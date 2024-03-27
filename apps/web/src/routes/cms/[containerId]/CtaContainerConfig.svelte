<script lang="ts">
	import { CallToActionPreset, CmsContainer, type CtaContainer } from "@frcn/cms";
	import { Input, Label } from "flowbite-svelte";
	import { getContext } from "svelte";

	import { Field, FieldValidator, Select } from "$lib/components";

    const presetOptions = Object.values(CallToActionPreset).filter(val => typeof val !== "string").map(preset => ({
        name: CallToActionPreset[preset as CallToActionPreset],
        value: preset
    }))
    
    function createEditData(container: CtaContainer) {
        return {
            identifier: container.getIdentifier(),
            text: container.getTitle(),
            preset: container.getPreset() ?? CallToActionPreset.None,
        }
    }
    
    export let container_: CmsContainer;
    export let validator: FieldValidator;
    export let isChild: boolean = false;

    let container = container_.as<CtaContainer>()
    $: container = container_.as<CtaContainer>()

    let editData = createEditData(container)
    $: {
        container.setIdentifier(editData.identifier)
        container.setTitle(editData.text)
        container.setPreset(editData.preset)
        getContext<() => void>("containerchange")()
    }
</script>

<Field {validator} for="cta-identifier-{container.id}" value={editData.identifier} required={!isChild}>
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
            placeholder="Text"
            pattern="[A-Za-z]"
            maxlength="255"
            bind:value={editData.text}
        />
    </Field>
{/if}