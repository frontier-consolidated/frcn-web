<script lang="ts">
    import { type CMSContainerType, type CmsContainer } from "@frcn/cms";
	import { strings } from "@frcn/shared";
	import { Accordion, AccordionItem, Dropdown, DropdownItem } from "flowbite-svelte";
	import { ArrowUpRightFromSquareOutline, ChevronDownSolid, TrashBinSolid } from "flowbite-svelte-icons";
	import { getContext } from "svelte";

	import { transformContainer } from "$lib/cms/transformContainer";
	import { Button, FieldValidator, ConfirmationModal } from "$lib/components";
	import { Mutations, get_apollo } from "$lib/graphql";
	import { push_notification } from "$lib/stores/NotificationStore";

	import ContainerConfigRenderer from "./ContainerConfigRenderer.svelte";

    export let container: CmsContainer;
    export let validator: FieldValidator;
    export let allowedChildren: CMSContainerType[];
    export let addName = "Add";

    let dropdown_open = false;
    let delete_container: CmsContainer | null = null;

    $: children = container.getChildrenOfTypes(allowedChildren);

    let change_fn = getContext<() => void>("containerchange");

    async function add_child(type: CMSContainerType) {
        dropdown_open = false;
        const { data, errors } = await get_apollo().mutate({
			mutation: Mutations.CREATE_CONTENT_CONTAINER,
			variables: {
				type: type,
				parent: container.id
			},
			errorPolicy: "all",
		});

		if (!data?.container || (errors && errors.length > 0)) {
			push_notification({
				type: "error",
				message: "Failed to add child",
			});
			console.error(errors);
			return;
		}

        const child_container = transformContainer(data.container);
        container.pushChild(child_container);
        children = container.getChildrenOfTypes(allowedChildren);
        change_fn();
    }
</script>

<section class="flex flex-col gap-2 p-2 rounded border border-gray-200 dark:border-gray-800">
    <div class="flex justify-end gap-2">
        <Button disabled={allowedChildren.length === 0} size="sm" on:click={() => {
            if (allowedChildren.length > 1) return;
            add_child(allowedChildren[0]).catch(console.error);
        }}>
            {addName}
            {#if allowedChildren.length > 1}
                <ChevronDownSolid class="w-3 h-3 ms-2 text-white dark:text-white" />
            {/if}
        </Button>
        {#if allowedChildren.length > 1}
            <Dropdown containerClass="rounded divide-y z-50" bind:open={dropdown_open}>
                {#each allowedChildren as type}
                    <DropdownItem on:click={() => add_child(type).catch(console.error)}>
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
                            <span class="font-medium text-black dark:text-white">
                                <strong>[{strings.toTitleCase(container.type)}]</strong> {container.getTitle()}
                                {#if container.getIdentifier()}
                                    <span class="text-sm text-gray-400"> #{container.getIdentifier()}</span>
                                {/if}
                            </span>
                            <span class="text-gray-300 dark:text-gray-500 text-xs">{container.id}</span>
                        </div>
                        <a href="/cms/{container.id}" target="_blank" class="ml-auto text-black hover:text-gray-800 dark:text-white dark:hover:text-gray-400" on:click={(e) => e.stopPropagation()}>
                            <ArrowUpRightFromSquareOutline size="sm" />
                        </a>
                        <TrashBinSolid class="text-black hover:text-red-500 dark:text-white dark:hover:text-red-600" on:click={(e) => {
                            e.stopPropagation();
                            delete_container = container;
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

<ConfirmationModal title="Delete container" open={!!delete_container} on:close={() => (delete_container = null)} on:confirm={async () => {
    if (!delete_container) return;
    
    const { errors } = await get_apollo().mutate({
        mutation: Mutations.DELETE_CONTENT_CONTAINER,
        variables: {
            id: delete_container.id
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

    container.removeChild(delete_container);
    delete_container = null;
    children = container.getChildrenOfTypes(allowedChildren);
}}>
    <span class="block text-gray-500 text-xs">Container Id: {delete_container?.id}</span>
    <span>Are you sure you want to delete this container? Once deleted it cannot be undone.</span>
</ConfirmationModal>