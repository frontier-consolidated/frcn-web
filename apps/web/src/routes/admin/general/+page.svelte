<script lang="ts">
	import { Helper, Input, Label } from "flowbite-svelte";
	import { CloseSolid, EditOutline, LockOpenSolid, LockSolid } from "flowbite-svelte-icons";

	import { SectionHeading, Field, FieldValidator, Button, Head } from "$lib/components";
	import { Mutations, get_apollo } from "$lib/graphql";
	import prevent_navigation from "$lib/preventNavigation";
	import { push_notification } from "$lib/stores/NotificationStore";

	import type { PageData } from "./$types";

    export let data: PageData;

    function clone_system_settings(data: PageData) {
        return {
            discordGuild: { ...data.discordGuild },
        };
    }

    const validator = new FieldValidator();
    let edit_data = clone_system_settings(data);

    const { can_navigate, init_navigation } = prevent_navigation();

	let is_dirty = false;
	$: {
		is_dirty = data.discordGuild.id !== edit_data.discordGuild.id;
		can_navigate.set(!is_dirty);
	}

    let guild_id_field_locked = true;

    async function save() {
        if (!validator.validate()) {
			push_notification({
				type: "error",
				message: "Check your inputs",
			});
			return;
		}

		const { data: updated_data, errors } = await get_apollo().mutate({
			mutation: Mutations.EDIT_SYSTEM_SETTINGS,
			variables: {
				data: {
                    discordGuildId: edit_data.discordGuild.id,
                }
			},
			errorPolicy: "all",
		});

		if (errors && errors.length > 0) {
			push_notification({
				type: "error",
				message: "Failed to save",
			});
			console.error(errors);
			return;
		}

		data = {
			...data, 
			...updated_data?.settings
		};
        edit_data = clone_system_settings(data);
	}
</script>

<Head
	title="General - Admin"
/>

<SectionHeading>
    General Settings
</SectionHeading>
<div class="flex-1 flex flex-col justify-between" use:init_navigation>
    <div class="flex flex-col gap-4 p-4">
        <Field {validator} for="system-general-guildid" value={"a"} required>
            <Label for="system-general-guildid" class="mb-1">Discord Guild</Label>
            <span class="block mb-1 text-xs text-gray-500">Current Guild: {data.discordGuild.name}</span>
            <Input
                class="flex-1 rounded"
                id="system-general-guildid"
                name="system-general-guildid"
                type="text"
                placeholder="0"
                pattern="[0-9]+"
                disabled={guild_id_field_locked}
                required
                bind:value={edit_data.discordGuild.id}
            >
                <button slot="right" class="text-gray-600 dark:text-gray-300" on:click={() => (guild_id_field_locked = !guild_id_field_locked)}>
                    <svelte:component this={guild_id_field_locked ? LockSolid : LockOpenSolid} tabindex="-1" class="outline-none" size="sm" />
                </button>
            </Input>
            <Helper class="mt-1">
                The discord guild that all discord related connections will be related to.
            </Helper>
            <Helper color="red" class="mt-1">
                * DO NOT CHANGE UNLESS YOU ABSOLUTELY NEED TO - THINGS WILL BREAK
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
            edit_data = clone_system_settings(data);
        }}>
            <CloseSolid class="me-2" tabindex="-1" /> Cancel
        </Button>
        <Button
            disabled={!is_dirty}
            on:click={() => {
                if (!is_dirty) return;
                save();
            }}
        >
            <EditOutline class="me-2" tabindex="-1" /> Save
        </Button>
    </div>
</div>