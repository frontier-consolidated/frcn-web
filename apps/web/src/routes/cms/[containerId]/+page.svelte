<script lang="ts">
	import { CMSContainerType, CmsContainer, CmsFile } from "@frcn/cms";
	import { strings } from "@frcn/shared";
	import { ArrowLeftSolid, CloseSolid, EditOutline } from "flowbite-svelte-icons";
	import { setContext } from "svelte";

	import { goto, invalidate } from "$app/navigation";
	import { transformContainer, type ContentContainerData } from "$lib/cms/transformContainer";
	import { Button, ConfirmationModal, FieldValidator, Head, SectionHeading } from "$lib/components";
	import { Mutations, getApollo } from "$lib/graphql";
	import preventNavigation from "$lib/preventNavigation";
	import { pushNotification } from "$lib/stores/NotificationStore";

	import type { PageData } from "./$types";
	import ContainerConfigRenderer from "./ContainerConfigRenderer.svelte";

	const validator = new FieldValidator();

	export let data: PageData;
	$: container = transformContainer(data.container);

	function checkIfFileDirty(
		source: ContentContainerData["files"][number],
		mutable: CmsFile,
		prefix = "",
		diff?: string[]
	) {
		let clean = true;
		diff ??= [];

		let valueClean;
		valueClean = source.identifier == mutable.getIdentifier();
		if (!valueClean) diff.push(prefix + mutable.id + ".identifier");
		clean &&= valueClean;

		return !clean;
	}

	function checkIfDirty(
		source: ContentContainerData,
		mutable: CmsContainer,
		traverseChildren = true,
		prefix = "",
		diff?: string[]
	) {
		let clean = true;
		diff ??= [];

		let valueClean;

		const rawData = mutable.getRawData();

		valueClean = source.identifier == rawData.identifier;
		if (!valueClean) diff.push(prefix + "identifier");
		clean &&= valueClean;

		valueClean = source.title === rawData.title;
		if (!valueClean) diff.push(prefix + "title");
		clean &&= valueClean;

		valueClean = source.content == rawData.content;
		if (!valueClean) diff.push(prefix + "content");
		clean &&= valueClean;

		valueClean = (source.children?.length ?? 0) === mutable.getChildren().length;
		if (!valueClean) diff.push(prefix + "children.length");
		clean &&= valueClean;

		if (traverseChildren) {
			for (const child of mutable.getChildren()) {
				const sourceChild = (source.children ?? []).find((c) => c.id === child.id);
				if (!sourceChild) {
					diff.push(prefix + "children." + child.id);
					clean = false;
					continue;
				}
				const childClean = !checkIfDirty(
					sourceChild,
					child,
					true,
					`${prefix}children.${child.id}.`,
					diff
				);
				clean &&= childClean;
			}
		}

		valueClean = source.files.length === mutable.getFiles().length;
		if (!valueClean) diff.push(prefix + "files.length");
		clean &&= valueClean;

		for (const file of mutable.getFiles()) {
			const sourceFile = source.files.find((f) => f.id === file.id);
			if (!sourceFile) {
				diff.push(prefix + "files." + file.id);
				clean = false;
				continue;
			}

			const fileClean = !checkIfFileDirty(sourceFile, file, prefix + "files.", diff);
			clean &&= fileClean;
		}

		// if (!prefix && traverseChildren) console.log("DIFF", diff);
		return !clean;
	}

	const { canNavigate, initNavigation } = preventNavigation();

	let updateTrigger = false;
	setContext("containerchange", () => {
		updateTrigger = !updateTrigger;
	});

	let isDirty = false;
	$: {
		updateTrigger;
		isDirty = checkIfDirty(data.container, container);
		canNavigate.set(!isDirty);
	}

	async function save() {
		if (!validator.validate()) {
			pushNotification({
				type: "error",
				message: "Check your inputs"
			});
			return;
		}

		let promises: Promise<any>[] = [];
		function makeContainerEditPromise(container: CmsContainer) {
			const rawData = container.getRawData();
			promises.push(
				getApollo().mutate({
					mutation: Mutations.EDIT_CONTENT_CONTAINER,
					variables: {
						id: container.id,
						data: {
							identifier: rawData.identifier,
							title: rawData.title,
							content: rawData.content
						}
					}
				})
			);
		}

		function makeContainerFileEditPromise(file: CmsFile) {
			promises.push(
				getApollo().mutate({
					mutation: Mutations.EDIT_CONTENT_CONTAINER_FILE,
					variables: {
						id: file.id,
						data: {
							identifier: file.getIdentifier()
						}
					}
				})
			);
		}

		function makePromises(source: ContentContainerData, container: CmsContainer) {
			const dirty = checkIfDirty(source, container, false);
			if (dirty) makeContainerEditPromise(container);

			for (const file of container.getFiles()) {
				const sourceFile = source.files.find((f) => f.id === file.id);
				if (!sourceFile || checkIfFileDirty(sourceFile, file)) {
					makeContainerFileEditPromise(file);
				}
			}

			for (const child of container.getChildren()) {
				const sourceChild = (source.children ?? []).find((c) => c.id === child.id);
				if (!sourceChild) {
					makeContainerEditPromise(child);
					continue;
				}
				makePromises(sourceChild, child);
			}
		}

		makePromises(data.container, container);

		try {
			await Promise.all(promises);
		} catch (err) {
			pushNotification({
				type: "error",
				message: "Failed to save"
			});
			console.error(err);
			return;
		}

		await invalidate("cms:currentcontainer");
	}

	let deleteModalOpen = false;
</script>

<Head title="Edit Container - CMS" />

<div
	class="mx-auto mt-24 flex min-h-[80vh] w-full max-w-4xl flex-col rounded bg-gray-50 px-3 py-4 dark:bg-gray-900"
	use:initNavigation
>
	{#if data.container.parent?.id}
		<a
			class="mb-2 flex cursor-pointer items-center p-2 text-gray-300 hover:text-gray-400"
			href="/cms/{data.container.parent.id}"
		>
			<ArrowLeftSolid class="me-2" tabindex="-1" /> Back to Parent Container
		</a>
	{:else if container.type === CMSContainerType.Index}
		<a
			class="mb-2 flex cursor-pointer items-center p-2 text-gray-300 hover:text-gray-400"
			href="/cms"
		>
			<ArrowLeftSolid class="me-2" tabindex="-1" /> Back to Indexes
		</a>
	{/if}
	<SectionHeading>
		Edit Container - {strings.toTitleCase(container.type)}
	</SectionHeading>
	<div class="flex flex-1 flex-col justify-between">
		<div class="flex flex-col gap-4 p-4">
			<ContainerConfigRenderer {validator} isChild={!!data.container.parent} bind:container />
		</div>
		<div class="flex items-center justify-end gap-2">
			<Button
				color="red"
				class="mr-auto"
				on:click={() => {
					deleteModalOpen = true;
				}}
			>
				<CloseSolid class="me-2" tabindex="-1" /> Delete
			</Button>
			<Button
				color="alternative"
				on:click={() => {
					container = transformContainer(data.container);
				}}
			>
				<CloseSolid class="me-2" tabindex="-1" /> Cancel
			</Button>
			<Button
				disabled={!isDirty}
				on:click={() => {
					if (!isDirty) return;
					save().catch(console.error);
				}}
			>
				<EditOutline class="me-2" tabindex="-1" /> Save
			</Button>
		</div>
	</div>
</div>

<ConfirmationModal
	title="Delete container"
	bind:open={deleteModalOpen}
	on:confirm={async () => {
		const { errors } = await getApollo().mutate({
			mutation: Mutations.DELETE_CONTENT_CONTAINER,
			variables: {
				id: container.id
			},
			errorPolicy: "all"
		});

		if (errors && errors.length > 0) {
			pushNotification({
				type: "error",
				message: "Failed to delete container"
			});
			console.error(errors);
			return;
		}

		deleteModalOpen = false;
		goto("/cms");
	}}
>
	<span>Are you sure you want to delete this container? Once deleted it cannot be undone.</span>
</ConfirmationModal>
