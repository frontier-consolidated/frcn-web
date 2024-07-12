<script lang="ts">
	import { CMSContainerType, AboutSectionContainer, CmsContainer, AboutSectionContainerPositions, CmsFile } from "@frcn/cms";
	import { strings } from "@frcn/shared";
	import { Helper, Input, Label } from "flowbite-svelte";
	import { getContext } from "svelte";

	import { Routes, api } from "$lib/api";
	import { Field, FieldValidator, ImageInput, MarkdownEditor, Select } from "$lib/components";
	import { Mutations, get_apollo } from "$lib/graphql";
	import { push_notification } from "$lib/stores/NotificationStore";

	import ContainerChildrenInput from "./ContainerChildrenInput.svelte";
    
    function create_edit_data(container: AboutSectionContainer) {
        return {
            identifier: container.getIdentifier(),
            position: container.getPosition() ?? "top-left",
            title: container.getTitle(),
            content: container.getContent() ?? "",
        };
    }
    
    export let container_: CmsContainer;
    export let validator: FieldValidator;
    export let isChild: boolean = false;

    let container = container_.as<AboutSectionContainer>();
    $: container = container_.as<AboutSectionContainer>();

    let default_image_file = container.getDefaultImageFile();
    let desktop_image_file = container.getDesktopImageFile();

    let edit_data = create_edit_data(container);
    $: {
        container.setIdentifier(edit_data.identifier);
        container.setPosition(edit_data.position);
        container.setTitle(edit_data.title);
        container.setContent(edit_data.content);
        getContext<() => void>("containerchange")();
    }

    async function upload_file(file: File, identifier: string, current_file: CmsFile | null) {
        push_notification({
			type: "info",
			message: "Uploading file...",
		});

		const form_data = new FormData();
		form_data.append("file", file);
        form_data.append("metadata", JSON.stringify({ identifier }));
		try {
			const response = await api.post(Routes.upload("cms_container", container.id), form_data, {
				headers: {
					"Content-Type": "multipart/form-data"
				},
			});

            if (current_file) {
                container.removeFile(current_file);
            }

            current_file = new CmsFile({
                id: response.data.id,
                fileName: response.data.fileName,
                fileSizeKb: response.data.fileSizeKb,
                contentType: response.data.contentType,
                fileSrc: response.data.previewUrl,
                identifier
            });
            container.pushFile(current_file);
            
            push_notification({
                type: "success",
                message: "Successfully uploaded!",
            });
		} catch (err) {
			push_notification({
				type: "error",
				message: "Failed to upload file",
			});
			console.error(err);
		}
        return current_file;
    }

    async function remove_file(file: CmsFile) {
        const { errors } = await get_apollo().mutate({
            mutation: Mutations.DELETE_CONTENT_CONTAINER_FILE,
            variables: {
                id: file.id
            }
        });

        if (errors && errors.length > 0) {
            push_notification({
                type: "error",
                message: "Failed to delete image",
            });
            console.error(errors);
            return false;
        }
        return true;
    }
</script>

<Field {validator} for="about-section-identifier-{container.id}" value={edit_data.identifier} required={!isChild}>
    <Label for="about-section-identifier-{container.id}" class="mb-2">Identifier</Label>
    <Input
        class="rounded"
        id="about-section-identifier-{container.id}"
        name="about-section-identifier"
        type="text"
        placeholder="/"
        pattern="[A-Za-z]"
        maxlength="255"
        bind:value={edit_data.identifier}
    />
</Field>
<Field {validator} for="about-section-position-{container.id}" value={edit_data.position}>
    <Label for="about-section-position-{container.id}" class="mb-2">Position</Label>
    <Select
        id="about-section-position-{container.id}"
        name="about-section-position"
        options={AboutSectionContainerPositions.map(pos => ({
            name: strings.kebabCaseToTitleCase(pos),
            value: pos
        }))}
        required
        bind:value={edit_data.position}
    />
</Field>
<Field {validator} for="about-section-title-{container.id}" value={edit_data.title}>
    <Label for="about-section-title-{container.id}" class="mb-2">Title</Label>
    <Input
        class="rounded"
        id="about-section-title-{container.id}"
        name="about-section-title"
        type="text"
        placeholder="Title"
        pattern="[A-Za-z]"
        maxlength="255"
        bind:value={edit_data.title}
    />
</Field>
<Field {validator} for="about-section-content-{container.id}" value={edit_data.content}>
    <Label for="about-section-content-{container.id}" class="mb-2">Content</Label>
    <MarkdownEditor
        placeholder="Content"
        bind:value={edit_data.content}
    />
</Field>
<div>
    <Label class="mb-2">CTAs</Label>
    <ContainerChildrenInput {validator} {container} addName="Add CTA" allowedChildren={[CMSContainerType.CallToAction]} />
</div>
<div>
    <Label for="about-section-default-image-{container.id}" class="mb-2">Default Image</Label>
    <ImageInput id="about-section-default-image-{container.id}" name="about-section-default-image" src={default_image_file?.getSrc()} 
        upload={async (file) => {
            default_image_file = await upload_file(file, AboutSectionContainer.DEFAULT_IMAGE_IDENTIFIER, default_image_file);
        }}
        remove={async () => {
            if (!default_image_file) return;
            if (await remove_file(default_image_file)) {
                default_image_file = null;
            }
        }}
    />
    <Helper>
        Recommended image ratio is 2:1. Images will be scaled down to 1600w.
    </Helper>
</div>
<div>
    <Label for="about-section-default-image-{container.id}" class="mb-2">Desktop Image</Label>
    <ImageInput id="about-section-default-image-{container.id}" name="about-section-default-image" src={desktop_image_file?.getSrc()} 
        upload={async (file) => {
            desktop_image_file = await upload_file(file, AboutSectionContainer.DESKTOP_IMAGE_IDENTIFIER, desktop_image_file);
        }}
        remove={async () => {
            if (!desktop_image_file) return;
            if (await remove_file(desktop_image_file)) {
                desktop_image_file = null;
            }
        }}
    />
    <Helper>
        This image will replace the default image on desktop. Leave as the placeholder image to use the default image on desktop.
    </Helper>
</div>