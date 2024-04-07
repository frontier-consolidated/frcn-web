<script lang="ts">
    import { CmsFile, type CmsContainer } from "@frcn/cms";
	import { Accordion, AccordionItem, Modal, Label, Helper } from "flowbite-svelte";
	import { TrashBinSolid } from "flowbite-svelte-icons";
	import { getContext } from "svelte";

	import { Routes, api } from "$lib/api";
	import { Button, FieldValidator, ConfirmationModal, ImageInput } from "$lib/components";
	import { Mutations, getApollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";

	import ContainerFileConfig from "./ContainerFileConfig.svelte";

    export let container: CmsContainer;
    export let validator: FieldValidator;

    let openUploadModal = false;
    let deleteFile: CmsFile | null = null;

    $: files = container.getFiles();

    let changeFn = getContext<() => void>("containerchange");

    async function uploadFile(file: File) {
        pushNotification({
			type: "info",
			message: "Uploading file...",
		});

		const formData = new FormData();
		formData.append("file", file);
        
		try {
			const response = await api.post(Routes.upload("cms_container", container.id), formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				},
			});

            const newFile = new CmsFile({
                id: response.data.id,
                fileName: response.data.fileName,
                fileSizeKb: response.data.fileSizeKb,
                contentType: response.data.contentType,
                fileSrc: response.data.previewUrl,
            });
            container.pushFile(newFile);
            files = container.getFiles();
            changeFn();
            
            pushNotification({
                type: "success",
                message: "Successfully uploaded!",
            });
		} catch (err) {
			pushNotification({
				type: "error",
				message: "Failed to upload file",
			});
			console.error(err);
		}
    }
</script>

<section class="flex flex-col gap-2 p-2 rounded border border-gray-200 dark:border-gray-800">
    <div class="flex justify-end gap-2">
        <Button size="sm" on:click={() => (openUploadModal = true)}>
            Upload File
        </Button>
    </div>
    {#if files.length > 0}
        <Accordion>
            {#each files as file}
                <AccordionItem class="group-first-of-type:rounded-t group-last-of-type:rounded-b" paddingDefault="px-4 py-2">
                    <div slot="header" class="flex-1 flex items-center gap-4 pr-4">
                        {#if file.contentType.startsWith("image/")}
                            <img src={file.getSrc()} alt="Container file preview" class="rounded h-full max-h-[4rem]" />
                        {/if}
                        <div class="flex flex-col">
                            <span class="font-medium">{file.name}</span>
                            <span class="text-gray-500 text-xs">{file.id}</span>
                        </div>
                        <span class="ml-auto text-gray-500 text-xs">{file.sizeKb}KB</span>
                        <TrashBinSolid class="text-black hover:text-red-500 dark:text-white dark:hover:text-red-600" on:click={(e) => {
                            e.stopPropagation();
                            deleteFile = file;
                        }} />
                        <div class="self-stretch w-px ml-2 bg-gray-300 dark:bg-gray-600"></div>
                    </div>
                    <div class="flex flex-col gap-4">
                        <ContainerFileConfig {validator} {file} />
                    </div>
                </AccordionItem>
            {/each}
        </Accordion>
    {:else}
        <span class="block w-full text-sm text-center text-gray-500 py-4">No Files</span>
    {/if}
</section>

<Modal title="Upload file" open={openUploadModal}>
    <div>
        <Label for="upload-file-{container.id}" class="mb-2">Image</Label>
        <ImageInput id="upload-file-{container.id}" name="upload-file" class="max-w-none"
            upload={async (file) => {
                await uploadFile(file);
                openUploadModal = false;
            }}
        />
        <Helper>
            Images will be scaled down such that their major axis is {"<"}1600px.
        </Helper>
    </div>
</Modal>

<ConfirmationModal title="Delete file" open={!!deleteFile} on:close={() => (deleteFile = null)} on:confirm={async () => {
    if (!deleteFile) return;
    
    const { errors } = await getApollo().mutate({
        mutation: Mutations.DELETE_CONTENT_CONTAINER_FILE,
        variables: {
            id: deleteFile.id
        },
		errorPolicy: "all",
    });

    if (errors && errors.length > 0) {
        pushNotification({
            type: "error",
            message: "Failed to delete container",
        });
        console.error(errors);
        return;
    }

    container.removeFile(deleteFile);
    deleteFile = null;
    files = container.getFiles();
}}>
    <span class="block text-gray-500 text-xs">File Id: {deleteFile?.id}</span>
    <span>Are you sure you want to delete the <strong>{deleteFile?.name}</strong> file? Once deleted it cannot be undone.</span>
</ConfirmationModal>