<script lang="ts">
	import { CMSContainerType, CmsContainer, CmsFile, SectionContainer } from "@frcn/cms";
	import { Helper, Input, Label } from "flowbite-svelte";
	import { getContext } from "svelte";

	import { Routes, api } from "$lib/api";
	import { Field, FieldValidator, ImageInput, MarkdownEditor } from "$lib/components";
	import { Mutations, getApollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";

	import ContainerChildrenInput from "./ContainerChildrenInput.svelte";
    
    function createEditData(container: SectionContainer) {
        return {
            identifier: container.getIdentifier(),
            title: container.getTitle(),
            content: container.getContent() ?? "",
        }
    }
    
    export let container_: CmsContainer;
    export let validator: FieldValidator;
    export let isChild: boolean = false;

    let container = container_.as<SectionContainer>()
    $: container = container_.as<SectionContainer>()

    let imageFile: CmsFile | null = container.getFiles()[0]

    let editData = createEditData(container)
    $: {
        container.setIdentifier(editData.identifier)
        container.setTitle(editData.title)
        container.setContent(editData.content)
        getContext<() => void>("containerchange")()
    }

    async function uploadFile(file: File, currentFile: CmsFile | null) {
        pushNotification({
			type: "info",
			message: "Uploading file...",
		});

		const formData = new FormData()
		formData.append("file", file)
        
		try {
            if (currentFile) {
                await getApollo().mutate({
                    mutation: Mutations.DELETE_CONTENT_CONTAINER_FILE,
                    variables: {
                        id: currentFile.id
                    },
                })
                container.removeFile(currentFile)
            }

			const response = await api.post(Routes.upload("cms_container", container.id), formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				},
			})

            currentFile = new CmsFile({
                id: response.data.id,
                fileName: response.data.fileName,
                fileSizeKb: response.data.fileSizeKb,
                contentType: response.data.contentType,
                fileSrc: response.data.previewUrl,
            })
            container.pushFile(currentFile)
            
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
        return currentFile;
    }

    async function removeFile(file: CmsFile) {
        const { errors } = await getApollo().mutate({
            mutation: Mutations.DELETE_CONTENT_CONTAINER_FILE,
            variables: {
                id: file.id
            },
            errorPolicy: "all"
        })

        if (errors && errors.length > 0) {
            pushNotification({
                type: "error",
                message: "Failed to delete image",
            });
            console.error(errors);
            return false;
        }
        return true
    }
</script>

<Field {validator} for="section-identifier-{container.id}" value={editData.identifier} required={!isChild}>
    <Label for="section-identifier-{container.id}" class="mb-2">Identifier</Label>
    <Input
        class="rounded"
        id="section-identifier-{container.id}"
        name="section-identifier"
        type="text"
        placeholder="/"
        pattern="[A-Za-z]"
        maxlength="255"
        bind:value={editData.identifier}
    />
</Field>
<Field {validator} for="section-title-{container.id}" value={editData.title}>
    <Label for="section-title-{container.id}" class="mb-2">Title</Label>
    <Input
        class="rounded"
        id="section-title-{container.id}"
        name="section-title"
        type="text"
        placeholder="Title"
        pattern="[A-Za-z]"
        maxlength="255"
        bind:value={editData.title}
    />
</Field>
<Field {validator} for="section-content-{container.id}" value={editData.content}>
    <Label for="section-content-{container.id}" class="mb-2">Content</Label>
    <MarkdownEditor
        placeholder="Content"
        bind:value={editData.content}
    />
</Field>
<div>
    <Label class="mb-2">CTAs</Label>
    <ContainerChildrenInput {validator} {container} addName="Add CTA" allowedChildren={[CMSContainerType.CallToAction]} />
</div>
<div>
    <Label class="mb-2">Sub Sections</Label>
    <ContainerChildrenInput {validator} {container} addName="Add Section" allowedChildren={[CMSContainerType.Section]} />
</div>
<div>
    <Label for="section-image-{container.id}" class="mb-2">Image</Label>
    <ImageInput id="section-image-{container.id}" name="section-image" src={imageFile?.getSrc()} 
        upload={async (file) => {
            imageFile = await uploadFile(file, imageFile)
        }}
        remove={async () => {
            if (!imageFile) return;
            if (await removeFile(imageFile)) {
                imageFile = null
            }
        }}
    />
    <Helper>
        Images will be scaled down such that their major axis is {"<"}1600px.
    </Helper>
</div>