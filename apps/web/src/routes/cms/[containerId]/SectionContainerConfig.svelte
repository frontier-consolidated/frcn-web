<script lang="ts">
	import { CMSContainerType, CmsContainer, CmsFile, SectionContainer } from "@frcn/cms";
	import { Helper, Input, Label } from "flowbite-svelte";
	import { getContext } from "svelte";

	import { Routes, api } from "$lib/api";
	import { Field, FieldValidator, ImageInput, MarkdownEditor } from "$lib/components";
	import { Mutations, get_apollo } from "$lib/graphql";
	import { push_notification } from "$lib/stores/NotificationStore";

	import ContainerChildrenInput from "./ContainerChildrenInput.svelte";
    
    function create_edit_data(container: SectionContainer) {
        return {
            identifier: container.getIdentifier(),
            title: container.getTitle(),
            content: container.getContent() ?? "",
        };
    }
    
    export let container_: CmsContainer;
    export let validator: FieldValidator;
    export let isChild: boolean = false;

    let container = container_.as<SectionContainer>();
    $: container = container_.as<SectionContainer>();

    let image_file: CmsFile | null = container.getFiles()[0];

    let edit_data = create_edit_data(container);
    $: {
        container.setIdentifier(edit_data.identifier);
        container.setTitle(edit_data.title);
        container.setContent(edit_data.content);
        getContext<() => void>("containerchange")();
    }

    async function upload_file(file: File, current_file: CmsFile | null) {
        push_notification({
			type: "info",
			message: "Uploading file...",
		});

		const form_data = new FormData();
		form_data.append("file", file);
        
		try {
            if (current_file) {
                await get_apollo().mutate({
                    mutation: Mutations.DELETE_CONTENT_CONTAINER_FILE,
                    variables: {
                        id: current_file.id
                    },
                });
                container.removeFile(current_file);
            }

			const response = await api.post(Routes.upload("cms_container", container.id), form_data, {
				headers: {
					"Content-Type": "multipart/form-data"
				},
			});

            current_file = new CmsFile({
                id: response.data.id,
                fileName: response.data.fileName,
                fileSizeKb: response.data.fileSizeKb,
                contentType: response.data.contentType,
                fileSrc: response.data.previewUrl,
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
            },
            errorPolicy: "all"
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

<Field {validator} for="section-identifier-{container.id}" value={edit_data.identifier} required={!isChild}>
    <Label for="section-identifier-{container.id}" class="mb-2">Identifier</Label>
    <Input
        class="rounded"
        id="section-identifier-{container.id}"
        name="section-identifier"
        type="text"
        placeholder="/"
        pattern="[A-Za-z]"
        maxlength="255"
        bind:value={edit_data.identifier}
    />
</Field>
<Field {validator} for="section-title-{container.id}" value={edit_data.title}>
    <Label for="section-title-{container.id}" class="mb-2">Title</Label>
    <Input
        class="rounded"
        id="section-title-{container.id}"
        name="section-title"
        type="text"
        placeholder="Title"
        pattern="[A-Za-z]"
        maxlength="255"
        bind:value={edit_data.title}
    />
</Field>
<Field {validator} for="section-content-{container.id}" value={edit_data.content}>
    <Label for="section-content-{container.id}" class="mb-2">Content</Label>
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
    <Label class="mb-2">Sub Sections</Label>
    <ContainerChildrenInput {validator} {container} addName="Add Section" allowedChildren={[CMSContainerType.Section]} />
</div>
<div>
    <Label for="section-image-{container.id}" class="mb-2">Image</Label>
    <ImageInput id="section-image-{container.id}" name="section-image" src={image_file?.getSrc()} 
        upload={async (file) => {
            image_file = await upload_file(file, image_file);
        }}
        remove={async () => {
            if (!image_file) return;
            if (await remove_file(image_file)) {
                image_file = null;
            }
        }}
    />
    <Helper>
        Images will be scaled down such that their major axis is {"<"}1600px.
    </Helper>
</div>