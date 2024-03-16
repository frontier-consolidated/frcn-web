<script lang="ts">
	import { Helper, Input, Label } from 'flowbite-svelte';

	import { SectionHeading, Select, Field, FieldValidator } from '$lib/components';

    let validator = new FieldValidator();
</script>

<svelte:head>
	<title>General - Admin | Frontier Consolidated</title>
</svelte:head>

<SectionHeading>
    General Settings
</SectionHeading>
<div class="flex flex-col gap-4 p-4">
    <Field {validator} for="system-general-guildid" value={"a"} required>
        <Label for="system-general-guildid" class="mb-2">Discord Guild Id</Label>
        <Input
            class="rounded"
            id="system-general-guildid"
            name="Discord Guild Id"
            type="text"
            placeholder="1188196981508689950"
            pattern="[0-9]+"
            required
        />
        <Helper class="mt-1">
            The discord guild that all roles and events will be linked to
        </Helper>
    </Field>
    <Field {validator} for="system-general-guildid" value={"a"} required>
        <Label for="system-general-default-channel" class="mb-2">Default Event Channel</Label>
        <Select
            id="system-general-default-channel"
            name="Default Event Channel"
            required
        />
        <Helper class="mt-1">
            The default channel where events will be posted
        </Helper>
    </Field>
</div>