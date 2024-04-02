<script lang="ts">
	import { goto } from "$app/navigation";
	import { Helper, Label, Table, TableHead, TableHeadCell } from "flowbite-svelte";
	import { CloseSolid, EditOutline } from "flowbite-svelte-icons";

	import { Button, Field, FieldValidator, Head, SectionHeading, Select } from "$lib/components";
	import { Mutations, getApollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";

    import type { PageData } from './$types';
	import ChannelRow from "./ChannelRow.svelte";

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
                    name: channel.discord.name,
                })) ?? [{ value: editData.defaultChannel.id, name: editData.defaultChannel.discord?.name }]}
                required
                bind:value={editData.defaultChannel.id}
            />
            <Helper class="mt-1">
                The default channel where events will be posted
            </Helper>
        </Field>
    </div>
    <div class="flex justify-end gap-2 px-2 my-4">
        <Button class="shrink-0" on:click={async () => {
            try {
                // const { data: createData } = await getApollo().mutate({
                //     mutation: Mutations.CREATE_ACCESS_KEY,
                // });
    
                // if (createData && createData.key) {
                //     await goto(`/admin/channels/${createData.key.id}`, {
                //         invalidateAll: true,
                //         state: {
                //             newAccessKey: createData.key
                //         }
                //     });
                // }
            } catch (err) {
                pushNotification({
                    type: "error",
                    message: "Failed to create event channel link"
                })
                console.error(err)
            }
        }}>
            Link Channel
        </Button>
    </div>
    <div class="flex-1 flex flex-col overflow-y-auto">
        <Table divClass="relative">
            <TableHead>
                <TableHeadCell>
                    Channels - {data.channels.length}
                </TableHeadCell>
                <TableHeadCell class="w-32"></TableHeadCell>
            </TableHead>
            <tbody class="divide-y">
                {#each data.channels as channel}
                    {#key channel.id}
                        <ChannelRow {channel} />
                    {/key}
                {/each}
            </tbody>
        </Table>
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