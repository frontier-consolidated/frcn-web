<script lang="ts">
	import { invalidateAll, replaceState } from "$app/navigation";
	import { page } from "$app/stores";
	import { Permission, hasAdmin } from "@frcn/shared";
	import { Helper, Input, Label } from "flowbite-svelte";
	import { ArrowLeftSolid, CloseSolid, EditOutline, ExclamationCircleSolid } from "flowbite-svelte-icons";

	import { Button, Field, FieldValidator, Head, Tooltip } from "$lib/components";
	import PermissionToggles from "$lib/components/PermissionToggles.svelte";
	import SectionHeading from "$lib/components/SectionHeading.svelte";
	import { Mutations, getApollo } from "$lib/graphql";
	import preventNavigation from "$lib/preventNavigation";
	import { pushNotification } from "$lib/stores/NotificationStore";
    import { user } from "$lib/stores/UserStore";

	import type { PageData } from "./$types";

	export let data: PageData;

    const validator = new FieldValidator();

    let editData = { ...data.key };
    const { canNavigate, initNavigation } = preventNavigation();

	let isDirty = false;
	$: {
		isDirty = editData.description !== data.key.description || editData.permissions !== data.key.permissions;
		canNavigate.set(!isDirty);
	}

    let key = $page.state.newAccessKey?.key ?? null;
    if ($page.state.newAccessKey?.key) replaceState("", {
        newAccessKey: undefined
    });

    async function save() {
        if (!validator.validate()) return;

		const { data: updatedData, errors } = await getApollo().mutate({
			mutation: Mutations.EDIT_ACCESS_KEY,
			variables: {
				id: data.key.id,
				data: {
					description: editData.description,
                    permissions: editData.permissions
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

		await invalidateAll();
		data = {
			...data, 
			key: {
				...data.key,
				...updatedData?.key
			},
		} as PageData;
		editData = { ...data.key };
    }

    async function regenerate() {
        const { data: regeneratedData, errors } = await getApollo().mutate({
            mutation: Mutations.REGENERATE_ACCESS_KEY,
            variables: {
                id: data.key.id
            },
			errorPolicy: "all",
        });

        if (errors && errors.length > 0) {
			pushNotification({
				type: "error",
				message: "Failed to regenerate key",
			});
			console.error(errors);
			return;
		}

        key = regeneratedData?.key?.key ?? null;
    }

    function copy(e: MouseEvent) {
        if (!key) return;
        navigator.clipboard.writeText(key);
        (e.currentTarget as HTMLButtonElement).innerHTML = "Copied!";
        pushNotification({
            type: "success",
            message: "Copied key to clipboard!",
            timeout: 5000
        });
    }
</script>

<Head
	title="Edit Access Key - Admin"
/>

<a class="flex items-center text-gray-300 mb-2 p-2 cursor-pointer hover:text-gray-400" href="/admin/general/accesskeys">
	<ArrowLeftSolid class="me-2" tabindex="-1" /> Back to Access Keys
</a>
<SectionHeading>
    Edit Key - {data.key.id}
</SectionHeading>
<div class="flex-1 flex flex-col justify-between" use:initNavigation>
	<div class="flex flex-col gap-4 p-4">
        <Field {validator} for="access-key-description" value={editData.description}>
            <Label for="access-key-description" class="mb-2">Key Description</Label>
            <Input
                class="rounded"
                id="access-key-description"
                name="access-key-description"
                type="text"
                placeholder="Description"
                pattern="[A-Za-z]"
                bind:value={editData.description}
            />
        </Field>
        <div>
            <Label class="mb-1">Key</Label>
            <Helper>
                A key can only be viewed once, if a key has been lost you need to regenerated it. 
            </Helper>
            <span class="text-sm dark:text-white">{key ?? "●".repeat(32)}</span>
            <div class="flex gap-2 mt-1">
                {#if key}
                    <Button size="sm" on:click={copy}>
                        Copy
                    </Button>
                {/if}
                <Button size="sm" on:click={() => {
                    regenerate().catch(console.error);
                }}>
                    Reset Key
                </Button>
            </div>
        </div>
        <div>
            <Label class="mb-4">Permissions</Label>
            <PermissionToggles disableToggles={{ [Permission.Admin]: !hasAdmin($user.data?.permissions ?? 0) }} bind:permissions={editData.permissions} class="flex flex-col gap-4" let:info let:disabled>
                {#if info.permission === Permission.Admin && disabled}
                    <Tooltip>
                        <ExclamationCircleSolid slot="icon" class="ms-2 text-orange-400" />
                        Only admins can enable admin permissions for a key
                    </Tooltip>
                {/if}
            </PermissionToggles>
        </div>
	</div>
	<div class="flex justify-end items-center gap-2">
		<Button color="alternative" on:click={() => {
			editData = { ...data.key };
		}}>
			<CloseSolid class="me-2" tabindex="-1" /> Cancel
		</Button>
		<Button
			disabled={!isDirty}
			on:click={() => {
				if (!isDirty) return;
				save().catch(console.error);
			}}
		>
			<EditOutline class="me-2" tabindex="-1" /> Save
		</Button>
	</div>
</div>