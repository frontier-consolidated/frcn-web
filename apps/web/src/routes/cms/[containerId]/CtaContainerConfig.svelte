<script lang="ts">
	import { CallToActionPreset, CmsContainer, type CtaContainer } from "@frcn/cms";
	import { Input, Label } from "flowbite-svelte";
	import { getContext } from "svelte";

	import { Field, FieldValidator, Select } from "$lib/components";

    const preset_options = Object.values(CallToActionPreset).filter(val => typeof val !== "string").map(preset => ({
        name: CallToActionPreset[preset as CallToActionPreset],
        value: preset
    }));
    
    function create_edit_data(container: CtaContainer) {
        return {
            identifier: container.getIdentifier(),
            text: container.getTitle(),
            preset: container.getPreset() ?? CallToActionPreset.None,
        };
    }
    
    export let container_: CmsContainer;
    export let validator: FieldValidator;
    export let isChild: boolean = false;

    let container = container_.as<CtaContainer>();
    $: container = container_.as<CtaContainer>();

    let edit_data = create_edit_data(container);
    $: {
        container.setIdentifier(edit_data.identifier);
        container.setTitle(edit_data.text);
        container.setPreset(edit_data.preset);
        getContext<() => void>("containerchange")();
    }
</script>

<Field {validator} for="cta-identifier-{container.id}" value={edit_data.identifier} required={!isChild}>
    <Label for="cta-identifier-{container.id}" class="mb-2">Identifier</Label>
    <Input
        class="rounded"
        id="cta-identifier-{container.id}"
        name="cta-identifier"
        type="text"
        placeholder="/"
        pattern="[A-Za-z]"
        maxlength="255"
        bind:value={edit_data.identifier}
    />
</Field>
<Field {validator} for="cta-preset-{container.id}" value={edit_data.preset}>
    <Label for="cta-preset-{container.id}" class="mb-2">Preset</Label>
    <Select
        id="cta-preset-{container.id}"
        name="cta-preset"
        options={preset_options}
        required
        bind:value={edit_data.preset}
    />
</Field>
{#if edit_data.preset === CallToActionPreset.None}
    <Field {validator} for="cta-text-{container.id}" value={edit_data.text}>
        <Label for="cta-text-{container.id}" class="mb-2">Text</Label>
        <Input
            class="rounded"
            id="cta-text-{container.id}"
            name="cta-text"
            type="text"
            placeholder="Text"
            pattern="[A-Za-z]"
            maxlength="255"
            bind:value={edit_data.text}
        />
    </Field>
{/if}