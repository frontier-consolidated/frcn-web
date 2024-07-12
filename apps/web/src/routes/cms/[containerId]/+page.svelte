<script lang="ts">
	import { goto, invalidate } from "$app/navigation";
	import { CMSContainerType, CmsContainer, CmsFile } from "@frcn/cms";
    import { strings } from "@frcn/shared";
    import { ArrowLeftSolid, CloseSolid, EditOutline } from "flowbite-svelte-icons";
	import { setContext } from "svelte";

	import { transformContainer, type ContentContainerData } from "$lib/cms/transformContainer";
	import { Button, ConfirmationModal, FieldValidator, Head, SectionHeading } from "$lib/components";
	import { Mutations, get_apollo } from "$lib/graphql";
	import prevent_navigation from "$lib/preventNavigation";
	import { push_notification } from "$lib/stores/NotificationStore";

    import type { PageData } from "./$types";
	import ContainerConfigRenderer from "./ContainerConfigRenderer.svelte";

    const validator = new FieldValidator();

    export let data: PageData;
    $: container = transformContainer(data.container);

    function check_if_file_dirty(source: ContentContainerData["files"][number], mutable: CmsFile, prefix = "", diff?: string[]) {
        let clean = true;
		diff ??= [];

        let value_clean;
        value_clean = source.identifier == mutable.getIdentifier();
        if (!value_clean) diff.push(prefix + mutable.id + ".identifier");
        clean &&= value_clean;

        return !clean;
    }

    function check_if_dirty(source: ContentContainerData, mutable: CmsContainer, traverse_children = true, prefix = "", diff?: string[]) {
        let clean = true;
		diff ??= [];

        let value_clean;

        const raw_data = mutable.getRawData();

        value_clean = source.identifier == raw_data.identifier;
        if (!value_clean) diff.push(prefix + "identifier");
        clean &&= value_clean;

        value_clean = source.title === raw_data.title;
        if (!value_clean) diff.push(prefix + "title");
        clean &&= value_clean;

        value_clean = source.content == raw_data.content;
        if (!value_clean) diff.push(prefix + "content");
        clean &&= value_clean;

        value_clean = (source.children?.length ?? 0) === mutable.getChildren().length;
        if (!value_clean) diff.push(prefix + "children.length");
        clean &&= value_clean;

        if (traverse_children) {
            for (const child of mutable.getChildren()) {
                const source_child = (source.children ?? []).find(c => c.id === child.id);
                if (!source_child) {
                    diff.push(prefix + "children." + child.id);
                    clean = false;
                    continue;
                }
                const child_clean = !check_if_dirty(source_child, child, true, `${prefix}children.${child.id}.`, diff);
                clean &&= child_clean;
            }
        }

        value_clean = source.files.length === mutable.getFiles().length;
        if (!value_clean) diff.push(prefix + "files.length");
        clean &&= value_clean;

        for (const file of mutable.getFiles()) {
            const source_file = source.files.find(f => f.id === file.id);
            if (!source_file) {
                diff.push(prefix + "files." + file.id);
                clean = false;
                continue;
            }

            const file_clean = !check_if_file_dirty(source_file, file, prefix + "files.", diff);
            clean &&= file_clean;
        }
		
        // if (!prefix && traverseChildren) console.log("DIFF", diff);
		return !clean;
	}

	const { can_navigate, init_navigation } = prevent_navigation();

    let update_trigger = false;
    setContext("containerchange", () => {
        update_trigger = !update_trigger;
    });

	let is_dirty = false;
	$: {
        update_trigger;
		is_dirty = check_if_dirty(data.container, container);
		can_navigate.set(!is_dirty);
	}

    async function save() {
        if (!validator.validate()) {
			push_notification({
				type: "error",
				message: "Check your inputs",
			});
			return;
		}

        let promises: Promise<any>[] = [];
        function make_container_edit_promise(container: CmsContainer) {
            const raw_data = container.getRawData();
            promises.push(get_apollo().mutate({
                mutation: Mutations.EDIT_CONTENT_CONTAINER,
                variables: {
                    id: container.id,
                    data: {
                        identifier: raw_data.identifier,
                        title: raw_data.title,
                        content: raw_data.content
                    }
                }
            }));
        }

        function make_container_file_edit_promise(file: CmsFile) {
            promises.push(get_apollo().mutate({
                mutation: Mutations.EDIT_CONTENT_CONTAINER_FILE,
                variables: {
                    id: file.id,
                    data: {
                        identifier: file.getIdentifier(),
                    }
                }
            }));
        }

        function make_promises(source: ContentContainerData, container: CmsContainer) {
            const dirty = check_if_dirty(source, container, false);
            if (dirty) make_container_edit_promise(container);

            for (const file of container.getFiles()) {
                const source_file = source.files.find(f => f.id === file.id);
                if (!source_file || check_if_file_dirty(source_file, file)) {
                    make_container_file_edit_promise(file);
                }
            }

            for (const child of container.getChildren()) {
                const source_child = (source.children ?? []).find(c => c.id === child.id);
                if (!source_child) {
                    make_container_edit_promise(child);
                    continue;
                }
                make_promises(source_child, child);
            }
        }

        make_promises(data.container, container);

        try {
            await Promise.all(promises);
        } catch (err) {
            push_notification({
				type: "error",
				message: "Failed to save",
			});
			console.error(err);
			return;
        }

        await invalidate("cms:currentcontainer");
    }

    let delete_modal_open = false;
</script>

<Head
	title="Edit Container - CMS"
/>

<div class="mt-24 flex flex-col min-h-[80vh] py-4 px-3 w-full max-w-4xl mx-auto bg-gray-50 rounded dark:bg-gray-900" use:init_navigation>
    {#if data.container.parent?.id}
        <a class="flex items-center text-gray-300 mb-2 p-2 cursor-pointer hover:text-gray-400" href="/cms/{data.container.parent.id}">
            <ArrowLeftSolid class="me-2" tabindex="-1" /> Back to Parent Container
        </a>
    {:else if container.type === CMSContainerType.Index}
        <a class="flex items-center text-gray-300 mb-2 p-2 cursor-pointer hover:text-gray-400" href="/cms">
            <ArrowLeftSolid class="me-2" tabindex="-1" /> Back to Indexes
        </a>
    {/if}
    <SectionHeading>
        Edit Container - {strings.toTitleCase(container.type)}
    </SectionHeading>
    <div class="flex-1 flex flex-col justify-between">
        <div class="flex flex-col gap-4 p-4">
            <ContainerConfigRenderer {validator} isChild={!!data.container.parent} bind:container />
        </div>
        <div class="flex justify-end items-center gap-2">
            <Button color="red" class="mr-auto" on:click={() => {
                delete_modal_open = true;
            }}>
                <CloseSolid class="me-2" tabindex="-1" /> Delete
            </Button>
            <Button color="alternative" on:click={() => {
                container = transformContainer(data.container);
            }}>
                <CloseSolid class="me-2" tabindex="-1" /> Cancel
            </Button>
            <Button
                disabled={!is_dirty}
                on:click={() => {
                    if (!is_dirty) return;
                    save().catch(console.error);
                }}
            >
                <EditOutline class="me-2" tabindex="-1" /> Save
            </Button>
        </div>
    </div>
</div>

<ConfirmationModal title="Delete container" bind:open={delete_modal_open} on:confirm={async () => {
    const { errors } = await get_apollo().mutate({
        mutation: Mutations.DELETE_CONTENT_CONTAINER,
        variables: {
            id: container.id
        },
		errorPolicy: "all",
    });

    if (errors && errors.length > 0) {
        push_notification({
            type: "error",
            message: "Failed to delete container",
        });
        console.error(errors);
        return;
    }

    delete_modal_open = false;
	goto("/cms");
}}>
    <span>Are you sure you want to delete this container? Once deleted it cannot be undone.</span>
</ConfirmationModal>