<script lang="ts">
    import { type CMSContainerType, type CmsContainer } from "@frcn/cms";
	import { strings } from "@frcn/shared";
	import { Accordion, AccordionItem, Dropdown, DropdownItem } from "flowbite-svelte";
	import { ArrowUpRightFromSquareOutline, ChevronDownSolid, TrashBinSolid } from "flowbite-svelte-icons";
	import { getContext } from "svelte";

	import { transformContainer } from "$lib/cms/transformContainer";
	import { Button, FieldValidator } from "$lib/components";
	import ConfirmationModal from "$lib/components/modals/ConfirmationModal.svelte";
	import { Mutations, getApollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";

	import ContainerConfigRenderer from "./ContainerConfigRenderer.svelte";

    export let container: CmsContainer;
    export let validator: FieldValidator;
    export let allowedChildren: CMSContainerType[];
    export let addName = "Add"

    let openDropdown = false;
    let deleteContainer: CmsContainer | null = null;

    $: children = container.getChildrenOfTypes(allowedChildren);

    async function addChild(type: CMSContainerType) {
        openDropdown = false;
        const { data, errors } = await getApollo().mutate({
			mutation: Mutations.CREATE_CONTENT_CONTAINER,
			variables: {
				type: type,
				parent: container.id
			},
			errorPolicy: "all",
		});

		if (!data?.container || (errors && errors.length > 0)) {
			pushNotification({
				type: "error",
				message: "Failed to add child",
			});
			console.error(errors);
			return;
		}

        const childContainer = transformContainer(data.container)
        container.pushChild(childContainer)
        children = container.getChildrenOfTypes(allowedChildren);
        getContext<() => void>("containerchange")()
    }
</script>

<section class="flex flex-col gap-2 p-2 rounded border border-gray-200 dark:border-gray-800">
    <div class="flex justify-end gap-2">
        <Button disabled={allowedChildren.length === 0} size="sm" on:click={() => {
            if (allowedChildren.length > 1) return;
            addChild(allowedChildren[0]).catch(console.error)
        }}>
            {addName}
            {#if allowedChildren.length > 1}
                <ChevronDownSolid class="w-3 h-3 ms-2 text-white dark:text-white" />
            {/if}
        </Button>
        {#if allowedChildren.length > 1}
            <Dropdown containerClass="rounded divide-y z-50" bind:open={openDropdown}>
                {#each allowedChildren as type}
                    <DropdownItem on:click={() => addChild(type).catch(console.error)}>
                        {strings.toTitleCase(type)}
                    </DropdownItem>
                {/each}
            </Dropdown>
        {/if}
    </div>
    {#if children.length > 0}
        <Accordion>
            {#each children as container}
                <AccordionItem class="group-first-of-type:rounded-t group-last-of-type:rounded-b" paddingDefault="px-4 py-3">
                    <div slot="header" class="flex-1 flex items-center gap-4 pr-4">
                        <div class="flex flex-col">
                            <span class="font-medium"><strong>[{strings.toTitleCase(container.type)}]</strong> {container.getTitle()}</span>
                            <span class="text-gray-500 text-xs">{container.id}</span>
                        </div>
                        <a href="/cms/{container.id}" target="_blank" class="ml-auto text-black hover:text-gray-800 dark:text-white dark:hover:text-gray-400" on:click={(e) => e.stopPropagation()}>
                            <ArrowUpRightFromSquareOutline size="sm" />
                        </a>
                        <TrashBinSolid class="text-black hover:text-red-500 dark:text-white dark:hover:text-red-600" on:click={(e) => {
                            e.stopPropagation()
                            deleteContainer = container
                        }} />
                        <div class="self-stretch w-px ml-2 bg-gray-300 dark:bg-gray-600"></div>
                    </div>
                    <div class="flex flex-col gap-4">
                        <ContainerConfigRenderer {validator} {container} isChild />
                    </div>
                </AccordionItem>
            {/each}
        </Accordion>
    {:else}
        <span class="block w-full text-sm text-center text-gray-500 py-4">No Containers</span>
    {/if}
</section>

<ConfirmationModal title="Delete container" open={!!deleteContainer} on:close={() => (deleteContainer = null)} on:confirm={async () => {
    if (!deleteContainer) return;
    
    const { errors } = await getApollo().mutate({
        mutation: Mutations.DELETE_CONTENT_CONTAINER,
        variables: {
            id: deleteContainer.id
        },
		errorPolicy: "all",
    })

    if (errors && errors.length > 0) {
        pushNotification({
            type: "error",
            message: "Failed to delete container",
        });
        console.error(errors);
        return;
    }

    container.removeChild(deleteContainer)
    deleteContainer = null;
    children = container.getChildrenOfTypes(allowedChildren);
}}>
    <span class="block text-gray-500 text-xs">Container Id: {deleteContainer?.id}</span>
    <span>Are you sure you want to delete this container? Once deleted it cannot be undone.</span>
</ConfirmationModal>