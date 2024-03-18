<script lang="ts">
	import { invalidateAll } from "$app/navigation";
    import { Modal, Label, Input, Textarea } from "flowbite-svelte"
    import { UploadSolid, FileSolid } from "flowbite-svelte-icons"

	import { Routes, api } from "$lib/api";
    import { Select, Field, FieldValidator, Button } from "$lib/components";
	import { Mutations, getApollo } from "$lib/graphql";
	import type { ResourceFragmentFragment } from "$lib/graphql/__generated__/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";

    const tags = [
        "Mining",
        "Salvage",
        "Cargo",
        "Combat",
        "Racing",
        "Illegal",
        "Misc",
        "Medical",
		"Support",
		"Trading",
    ]

	function cloneResourceData(data?: ResourceFragmentFragment | null) {
		return {
			name: data?.name ?? "",
			shortDescription: data?.shortDescription ?? "",
			tags: data?.tags ?? []
		}
	}

    export let open: boolean = false;
	export let data: ResourceFragmentFragment | null = null;
	let editData = cloneResourceData(data)

	$: isDirty = !!data && (data.name !== editData.name || data.shortDescription !== editData.shortDescription || data.tags.length !== editData.tags.length || data.tags.some(tag => !editData.tags.find(t => t === tag)))

	let lastData = data;

	$: {
		if (lastData !== data) {
			editData = cloneResourceData(data)
		}
		lastData = data
	}

    let uploadInput: HTMLInputElement | null = null;
	let uploadFiles: FileList;

	function handleFileKeydown(ev: KeyboardEvent) {
		if (uploadInput && [' ', 'Enter'].includes(ev.key)) {
			ev.preventDefault();
			uploadInput.click();
		}
	}

	const validator = new FieldValidator()

	async function upload() {
		const valid = validator.validate()
		if (!valid) return;

		if (!uploadFiles || uploadFiles.length < 1) {
			pushNotification({
				type: "error",
				message: "No file found",
			});
			return 
		}

		const { data: createData, errors } = await getApollo().mutate({
			mutation: Mutations.CREATE_RESOURCE,
			variables: {
				data: {
					name: editData.name,
					shortDescription: editData.shortDescription,
					tags: editData.tags
				}
			},
			errorPolicy: "all",
		});

		if (errors && errors.length > 0) {
			pushNotification({
				type: "error",
				message: "Failed to create resource",
			});
			console.error(errors);
			return;
		}

		pushNotification({
			type: "info",
			message: "Uploading file...",
		});

		const formData = new FormData()
		formData.append("file", uploadFiles[0])
		try {
			await api.post(Routes.resource(createData!.resource.id), formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				},
			})
		} catch (err) {
			pushNotification({
				type: "error",
				message: "Failed to upload file for resource",
			});
			console.error(err);
			return;
		}

		pushNotification({
			type: "success",
			message: "Resource created!",
		});

		await invalidateAll()
		open = false;
	}

	async function save() {
		if (!data) return;
		if (!validator.validate()) return;

		const { errors } = await getApollo().mutate({
			mutation: Mutations.EDIT_RESOURCE,
			variables: {
				id: data.id,
				data: {
					name: editData.name,
					shortDescription: editData.shortDescription,
					tags: editData.tags
				}
			},
			errorPolicy: "all",
		});

		if (errors && errors.length > 0) {
			pushNotification({
				type: "error",
				message: "Failed to save resource",
			});
			console.error(errors);
			return;
		}

		await invalidateAll()
		open = false;
	}
</script>

<Modal title={data ? `Edit - ${data.name}` : "Upload resource"} bind:open dismissable>
	<div class="flex flex-col gap-4 p-4">
		<Field 
			{validator}
			for="resource-upload-name"
			value={editData.name}
			required
		>
			<Label for="resource-upload-name" class="mb-2">Name</Label>
			<Input
				class="rounded"
				id="resource-upload-name"
				name="Resource Upload Name"
				type="text"
				placeholder="Resource name"
				required
                maxlength="255"
				bind:value={editData.name}
			/>
		</Field>
        <Field 
			{validator}
			for="resource-upload-description"
			value={editData.shortDescription}
			required
		>
			<Label for="resource-upload-description" class="mb-2">Description</Label>
			<Textarea
                class="rounded bg-gray-50 text-gray-900 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-500"
				id="resource-upload-description"
				name="Resource Upload Description"
				type="text"
				placeholder="Resource description"
				required
                maxlength="512"
				bind:value={editData.shortDescription}
			/>
		</Field>
        <Field 
			{validator}
			for="resource-upload-tags"
			value={editData.tags}
			required
		>
			<Label for="resource-upload-tags" class="mb-2">Tags</Label>
            <Select
                id="resource-upload-tags"
                name="Resource Upload Tags"
                options={tags.map(tag => ({
                    value: tag,
                    name: tag,
                }))}
                required
                multi
                search
				bind:value={editData.tags}
            />
		</Field>
		{#if !data}
			<Field {validator} for="resource-upload" value={uploadFiles} required>
				<Label for="resource-upload" class="mb-2">Files</Label>
				<button
					type="button"
					class="relative flex justify-center items-center w-full h-64 bg-gray-50 rounded border-2 border-gray-300 border-dashed dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600" 
					on:keydown={handleFileKeydown}
				>
					{#if uploadFiles?.length > 0}
						<div class="flex flex-col items-center">
							{#if uploadFiles[0].type.startsWith("image")}
								<img src={URL.createObjectURL(uploadFiles[0])} alt="Preview image of '{uploadFiles[0].name}' file" class="rounded h-32" />
							{:else}
								<FileSolid class="text-white" size="xl" tabindex="-1" />
							{/if}
							<p class="text-md text-gray-500 dark:text-gray-400">{uploadFiles[0].name}</p>
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
						name="File Upload"
						accept="image/*,.pdf"
						class="absolute cursor-pointer top-0 left-0 h-full w-full z-0 opacity-0" 
						bind:this={uploadInput} 
						bind:files={uploadFiles}
					/>
				</button>
			</Field>
		{/if}
	</div>
	<svelte:fragment slot="footer">
		{#if data}
			<Button disabled={!isDirty} on:click={() => {
				save().catch(console.error)
			}}>
				Save
			</Button>
		{:else}
			<Button on:click={() => {
				upload().catch(console.error)
			}}>
				Upload
			</Button>
		{/if}
			<Button color="alternative" on:click={() => {
				open = false
				editData = cloneResourceData(data)
			}}>
				Cancel
			</Button>
  	</svelte:fragment>
</Modal>
