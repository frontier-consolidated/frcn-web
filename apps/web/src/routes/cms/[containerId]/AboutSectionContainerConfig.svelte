<script lang="ts">
	import { CMSContainerType, AboutSectionContainer, CmsContainer, AboutSectionContainerPositions, CmsFile } from "@frcn/cms";
	import { strings } from "@frcn/shared";
	import { Helper, Input, Label } from "flowbite-svelte";
	import { getContext } from "svelte";

	import { Routes, api } from "$lib/api";
	import { Field, FieldValidator, ImageInput, MarkdownEditor, Select } from "$lib/components";
	import { Mutations, getApollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";

	import ContainerChildrenInput from "./ContainerChildrenInput.svelte";
    
    function createEditData(container: AboutSectionContainer) {
        return {
            identifier: container.getIdentifier(),
            position: container.getPosition() ?? "top-left",
            title: container.getTitle(),
            content: container.getContent() ?? "",
        }
    }
    
    export let container_: CmsContainer;
    export let validator: FieldValidator;
    export let isChild: boolean = false;

    let container = container_.as<AboutSectionContainer>()
    $: container = container_.as<AboutSectionContainer>()

    let defaultImageFile = container.getDefaultImageFile()
    let desktopImageFile = container.getDesktopImageFile()

    let editData = createEditData(container)
    $: {
        container.setIdentifier(editData.identifier)
        container.setPosition(editData.position)
        container.setTitle(editData.title)
        container.setContent(editData.content)
        getContext<() => void>("containerchange")()
    }

    async function uploadFile(file: File, identifier: string, currentFile: CmsFile | null) {
        pushNotification({
			type: "info",
			message: "Uploading file...",
		});

		const formData = new FormData()
		formData.append("file", file)
        formData.append("metadata", JSON.stringify({ identifier }))
		try {
			const response = await api.post(Routes.upload("cms_container", container.id), formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				},
			})

            if (currentFile) {
                container.removeFile(currentFile)
            }

            currentFile = new CmsFile({
                id: response.data.id,
                fileName: response.data.fileName,
                fileSizeKb: response.data.fileSizeKb,
                contentType: response.data.contentType,
                fileSrc: response.data.previewUrl,
                identifier
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
            }
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

<Field {validator} for="about-section-identifier-{container.id}" value={editData.identifier} required={!isChild}>
    <Label for="about-section-identifier-{container.id}" class="mb-2">Identifier</Label>
    <Input
        class="rounded"
        id="about-section-identifier-{container.id}"
        name="about-section-identifier"
        type="text"
        placeholder="/"
        pattern="[A-Za-z]"
        maxlength="255"
        bind:value={editData.identifier}
    />
</Field>
<Field {validator} for="about-section-position-{container.id}" value={editData.position}>
    <Label for="about-section-position-{container.id}" class="mb-2">Position</Label>
    <Select
        id="about-section-position-{container.id}"
        name="about-section-position"
        options={AboutSectionContainerPositions.map(pos => ({
            name: strings.kebabCaseToTitleCase(pos),
            value: pos
        }))}
        required
        bind:value={editData.position}
    />
</Field>
<Field {validator} for="about-section-title-{container.id}" value={editData.title}>
    <Label for="about-section-title-{container.id}" class="mb-2">Title</Label>
    <Input
        class="rounded"
        id="about-section-title-{container.id}"
        name="about-section-title"
        type="text"
        placeholder="Title"
        pattern="[A-Za-z]"
        maxlength="255"
        bind:value={editData.title}
    />
</Field>
<Field {validator} for="about-section-content-{container.id}" value={editData.content}>
    <Label for="about-section-content-{container.id}" class="mb-2">Content</Label>
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
    <Label for="about-section-default-image-{container.id}" class="mb-2">Default Image</Label>
    <ImageInput id="about-section-default-image-{container.id}" name="about-section-default-image" src={defaultImageFile?.getSrc()} 
        upload={async (file) => {
            defaultImageFile = await uploadFile(file, AboutSectionContainer.DEFAULT_IMAGE_IDENTIFIER, defaultImageFile)
        }}
        remove={async () => {
            if (!defaultImageFile) return;
            if (await removeFile(defaultImageFile)) {
                defaultImageFile = null
            }
        }}
    />
    <Helper>
        Recommended image ratio is 2:1. Images will be scaled down to 1600w.
    </Helper>
</div>
<div>
    <Label for="about-section-default-image-{container.id}" class="mb-2">Desktop Image</Label>
    <ImageInput id="about-section-default-image-{container.id}" name="about-section-default-image" src={desktopImageFile?.getSrc()} 
        upload={async (file) => {
            desktopImageFile = await uploadFile(file, AboutSectionContainer.DESKTOP_IMAGE_IDENTIFIER, desktopImageFile)
        }}
        remove={async () => {
            if (!desktopImageFile) return;
            if (await removeFile(desktopImageFile)) {
                desktopImageFile = null
            }
        }}
    />
    <Helper>
        This image will replace the default image on desktop. Leave as the placeholder image to use the default image on desktop.
    </Helper>
</div>