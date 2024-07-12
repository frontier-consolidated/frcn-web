<script lang="ts">
	import { invalidateAll } from "$app/navigation";
    import { Modal, Label, Input, Textarea } from "flowbite-svelte";
    import { UploadSolid, FileSolid } from "flowbite-svelte-icons";

	import { Routes, api } from "$lib/api";
    import { Select, Field, FieldValidator, Button } from "$lib/components";
	import { Mutations, get_apollo } from "$lib/graphql";
	import type { ResourceFragmentFragment } from "$lib/graphql/__generated__/graphql";
	import { push_notification } from "$lib/stores/NotificationStore";

	import { tags } from "./tags";

	function clone_resource_data(data?: ResourceFragmentFragment | null) {
		return {
			name: data?.name ?? "",
			shortDescription: data?.shortDescription ?? "",
			tags: data?.tags ?? []
		};
	}

    export let open: boolean = false;
	export let data: ResourceFragmentFragment | null = null;
	let edit_data = clone_resource_data(data);

	$: isDirty = !!data && (data.name !== edit_data.name || data.shortDescription !== edit_data.shortDescription || data.tags.length !== edit_data.tags.length || data.tags.some(tag => !edit_data.tags.find(t => t === tag)));

	let last_data = data;

	$: {
		if (last_data !== data) {
			edit_data = clone_resource_data(data);
		}
		last_data = data;
	}

    let upload_input: HTMLInputElement | null = null;
	let upload_files: FileList;

	function handle_file_keydown(ev: KeyboardEvent) {
		if (upload_input && [" ", "Enter"].includes(ev.key)) {
			ev.preventDefault();
			upload_input.click();
		}
	}

	const validator = new FieldValidator();

	function clear() {
		edit_data = clone_resource_data(data);
		if (upload_input) upload_input.value = "";
	}

	async function upload() {
		const valid = validator.validate();
		if (!valid) return;

		if (!upload_files || upload_files.length < 1) {
			push_notification({
				type: "error",
				message: "No file found",
			});
			return; 
		}

		const { data: create_data, errors } = await get_apollo().mutate({
			mutation: Mutations.CREATE_RESOURCE,
			variables: {
				data: {
					name: edit_data.name,
					shortDescription: edit_data.shortDescription,
					tags: edit_data.tags
				}
			},
			errorPolicy: "all",
		});

		if (errors && errors.length > 0) {
			push_notification({
				type: "error",
				message: "Failed to create resource",
			});
			console.error(errors);
			return;
		}

		push_notification({
			type: "info",
			message: "Uploading file...",
		});

		const form_data = new FormData();
		form_data.append("file", upload_files[0]);
		try {
			await api.post(Routes.upload("resource", create_data!.resource.id), form_data, {
				headers: {
					"Content-Type": "multipart/form-data"
				},
			});
		} catch (err) {
			push_notification({
				type: "error",
				message: "Failed to upload file for resource",
			});
			console.error(err);
			return;
		}

		push_notification({
			type: "success",
			message: "Resource created!",
		});

		clear();
		await invalidateAll();
		open = false;
	}

	async function save() {
		if (!data) return;
		if (!validator.validate()) {
			push_notification({
				type: "error",
				message: "Check your inputs",
			});
			return;
		}

		const { errors } = await get_apollo().mutate({
			mutation: Mutations.EDIT_RESOURCE,
			variables: {
				id: data.id,
				data: {
					name: edit_data.name,
					shortDescription: edit_data.shortDescription,
					tags: edit_data.tags
				}
			},
			errorPolicy: "all",
		});

		if (errors && errors.length > 0) {
			push_notification({
				type: "error",
				message: "Failed to save resource",
			});
			console.error(errors);
			return;
		}

		await invalidateAll();
		open = false;
	}
</script>

<Modal title={data ? `Edit - ${data.name}` : "Upload resource"} bind:open dismissable>
	<div class="flex flex-col gap-4 p-4">
		<Field 
			{validator}
			for="resource-upload-name"
			value={edit_data.name}
			required
		>
			<Label for="resource-upload-name" class="mb-2">Name</Label>
			<Input
				class="rounded"
				id="resource-upload-name"
				name="resource-upload-name"
				type="text"
				placeholder="Resource name"
				required
                maxlength="255"
				autocomplete="new-password"
				bind:value={edit_data.name}
			/>
		</Field>
        <Field 
			{validator}
			for="resource-upload-description"
			value={edit_data.shortDescription}
		>
			<Label for="resource-upload-description" class="mb-2">Description</Label>
			<Textarea
                class="rounded bg-gray-50 text-gray-900 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-500"
				id="resource-upload-description"
				name="resource-upload-description"
				type="text"
				placeholder="Resource description"
                maxlength="512"
				autocomplete="new-password"
				bind:value={edit_data.shortDescription}
			/>
		</Field>
        <Field 
			{validator}
			for="resource-upload-tags"
			value={edit_data.tags}
			required
		>
			<Label for="resource-upload-tags" class="mb-2">Tags</Label>
            <Select
                id="resource-upload-tags"
                name="resource-upload-tags"
                options={tags.map(tag => ({
                    value: tag,
                    name: tag,
                }))}
                required
                multi
                search
				bind:value={edit_data.tags}
            />
		</Field>
		{#if !data}
			<Field {validator} for="resource-upload" value={upload_files} required>
				<Label for="resource-upload" class="mb-2">Files</Label>
				<button
					type="button"
					class="relative flex justify-center items-center w-full h-64 bg-gray-50 rounded border-2 border-gray-300 border-dashed dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600" 
					on:keydown={handle_file_keydown}
				>
					{#if upload_files?.length > 0}
						<div class="flex flex-col items-center">
							{#if upload_files[0].type.startsWith("image")}
								<img src={URL.createObjectURL(upload_files[0])} alt="Preview image of '{upload_files[0].name}' file" class="rounded h-32" />
							{:else}
								<FileSolid class="text-white" size="xl" tabindex="-1" />
							{/if}
							<p class="text-md text-gray-500 dark:text-gray-400">{upload_files[0].name}</p>
						</div>
					{:else}
						<div class="flex flex-col items-center w-full flex-1">
							<UploadSolid class="mb-3" size="lg" tabindex="-1" />
							<p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF, SVG or PDF</p>
						</div>
					{/if}
					<input 
						type="file"
						id="resource-upload"
						name="resource-upload"
						accept="image/*,.pdf"
						class="absolute cursor-pointer top-0 left-0 h-full w-full z-0 opacity-0" 
						bind:this={upload_input} 
						bind:files={upload_files}
					/>
				</button>
			</Field>
		{/if}
	</div>
	<svelte:fragment slot="footer">
		{#if data}
			<Button disabled={!isDirty} on:click={() => {
				save().catch(console.error);
			}}>
				Save
			</Button>
		{:else}
			<Button on:click={() => {
				upload().catch(console.error);
			}}>
				Upload
			</Button>
		{/if}
			<Button color="alternative" on:click={() => {
				open = false;
				clear();
			}}>
				Cancel
			</Button>
  	</svelte:fragment>
</Modal>
