<script lang="ts">
	import { Helper, Input, Label } from 'flowbite-svelte';
	import { CloseSolid, EditOutline } from 'flowbite-svelte-icons';

	import { SectionHeading, Field, FieldValidator, Button, Head } from '$lib/components';
	import { Mutations, getApollo } from '$lib/graphql';
	import { pushNotification } from '$lib/stores/NotificationStore';

	import type { PageData } from './$types';

    export let data: PageData;

    function cloneSystemSettings(data: PageData) {
        return {
            discordGuild: { ...data.discordGuild },
        }
    }

    const validator = new FieldValidator();
    let editData = cloneSystemSettings(data)

    $: isDirty = data.discordGuild.id !== editData.discordGuild.id

    async function save() {
        if (!validator.validate()) return;

		const { data: updatedData, errors } = await getApollo().mutate({
			mutation: Mutations.EDIT_SYSTEM_SETTINGS,
			variables: {
				data: {
                    discordGuildId: editData.discordGuild.id,
                }
			},
			errorPolicy: "all",
		});

		if (errors && errors.length > 0) {
			pushNotification({
				type: "error",
				message: "Failed to save",
			});
			console.error(errors);
			return;
		}

		data = {
			...data, 
			...updatedData?.settings
		}
        editData = cloneSystemSettings(data)
	}
</script>

<Head
	title="General - Admin"
/>

<SectionHeading>
    General Settings
</SectionHeading>
<div class="flex-1 flex flex-col justify-between">
    <div class="flex flex-col gap-4 p-4">
        <Field {validator} for="system-general-guildid" value={"a"} required>
            <Label for="system-general-guildid" class="mb-1">Discord Guild</Label>
            <span class="block mb-1 text-xs text-gray-500">Current Guild: {data.discordGuild.name}</span>
            <Input
                class="rounded"
                id="system-general-guildid"
                name="system-general-guildid"
                type="text"
                placeholder="0"
                pattern="[0-9]+"
                required
                bind:value={editData.discordGuild.id}
            />
            <Helper class="mt-1">
                The discord guild that all roles and events will be linked to
            </Helper>
        </Field>
        <div>
            <Label class="mb-2">Access Keys</Label>
            <Button href="/admin/general/accesskeys" color="dark" size="sm">
                Manage Access Keys
            </Button>
        </div>
    </div>
    <div class="flex justify-end items-center gap-2">
        <Button color="alternative" on:click={() => {
            editData = cloneSystemSettings(data)
        }}>
            <CloseSolid class="me-2" tabindex="-1" /> Cancel
        </Button>
        <Button
            disabled={!isDirty}
            on:click={() => {
                if (!isDirty) return;
                save();
            }}
        >
            <EditOutline class="me-2" tabindex="-1" /> Save
        </Button>
    </div>
</div>