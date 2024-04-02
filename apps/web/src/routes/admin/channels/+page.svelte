<script lang="ts">
	import { Helper, Label } from "flowbite-svelte";
	import { CloseSolid, EditOutline } from "flowbite-svelte-icons";

	import { Button, Field, FieldValidator, Head, SectionHeading, Select } from "$lib/components";
	import { Mutations, getApollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";

    import type { PageData } from './$types';

    export let data: PageData;

    function cloneSettings(data: PageData) {
        return {
            defaultChannel: { ...data.defaultEventChannel },
        }
    }

    const validator = new FieldValidator();
    let editData = cloneSettings(data)

    $: isDirty = data.defaultEventChannel?.id !== editData.defaultChannel.id

    async function save() {
        if (!validator.validate()) return;

		const { data: updatedData, errors } = await getApollo().mutate({
			mutation: Mutations.EDIT_SYSTEM_SETTINGS,
			variables: {
				data: {
                    defaultEventChannelId: editData.defaultChannel.id
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
        editData = cloneSettings(data)
	}
</script>

<Head
	title="Event Channels - Admin"
/>

<SectionHeading>
    Event Channels
</SectionHeading>
<div class="flex-1 flex flex-col justify-between">
    <div class="flex flex-col gap-4 p-4">
        <Field {validator} for="system-general-guildid" value={"a"} required>
            <Label for="system-general-default-channel" class="mb-2">Default Event Channel</Label>
            <Select
                id="system-general-default-channel"
                name="system-general-default-channel"
                options={data.channels.map((channel) => ({
                    value: channel.id,
                    name: channel.name,
                })) ?? [{ value: editData.defaultChannel.id, name: editData.defaultChannel.name }]}
                required
                bind:value={editData.defaultChannel.id}
            />
            <Helper class="mt-1">
                The default channel where events will be posted
            </Helper>
        </Field>
    </div>
    <div class="flex justify-end items-center gap-2">
        <Button color="alternative" on:click={() => {
            editData = cloneSettings(data)
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