<script lang="ts">
	import { Permission, hasPermission } from "@frcn/shared";
	import { Button, Heading, Input, Label, Modal, Search } from "flowbite-svelte";
	import { CirclePlusSolid, UploadSolid } from "flowbite-svelte-icons";
	import { queryParam } from "sveltekit-search-params"

	import Hr from "$lib/components/Hr.svelte";
	import { user } from "$lib/stores/UserStore";

	const search = queryParam("q")

	let uploadModal = false;
	let uploadInput: HTMLInputElement | null = null;
	let uploadFiles: FileList;

	function handleFileKeydown(ev: KeyboardEvent) {
		if (uploadInput && [' ', 'Enter'].includes(ev.key)) {
			ev.preventDefault();
			uploadInput.click();
		}
	}

	// function handleFileDrop(event: DragEvent) {
	// 	event.preventDefault()
	// 	uploadFile = null

	// 	if (event.dataTransfer?.items) {
	// 		[...event.dataTransfer.items].forEach((item) => {
	// 			if (item.kind === "file") {
	// 				const file = item.getAsFile()
	// 				uploadFile = file;
	// 			}
	// 		})
	// 	} else if (event.dataTransfer?.files) {
	// 		[...event.dataTransfer.files].forEach((file) => {
	// 			uploadFile = file
	// 		})
	// 	}
	// }

	// function handleFileChange(event: Event) {
	// 	const files = (event.target as HTMLInputElement | null)?.files
	// 	if (files && files.length > 0) {
	// 		uploadFile = files[0]
	// 	}
	// }
</script>

<svelte:head>
	<title>Knowledge</title>
	<meta name="description" content="Frontier Consolidated - Search for Guides & Resources" />
</svelte:head>

<Heading tag="h1" class="font-medium text-4xl">Knowledge</Heading>
<Hr />
<section class="flex flex-col gap-2 mt-4">
	<div>
		<div class="flex flex-col sm:flex-row gap-2">
			<Search size="md" placeholder="Search by name" class="flex-1 sm:w-96" bind:value={$search} />
			{#if hasPermission($user.data?.permissions ?? 0, Permission.CreateEvents)}
				<Button
					class="self-end sm:shrink-0"
					on:click={() => (uploadModal = true)}
				>
					<CirclePlusSolid class="me-2" /> Upload File
				</Button>
			{/if}
		</div>
	</div>
</section>
<Modal title="Upload file" bind:open={uploadModal} dismissable>
	<div class="flex flex-col gap-4 p-4">
		<div>
			<Label for="file-upload-name" class="mb-2">File Name</Label>
			<Input
				id="file-upload-name"
				name="File Upload Name"
				type="text"
				placeholder="File name"
				required
			/>
		</div>
		<div>
			<Label for="file-upload" class="mb-2">Files</Label>
			<button
				type="button"
				class="relative flex justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600" 
				on:keydown={handleFileKeydown}
			>
				{#if uploadFiles?.length > 0}
					<p class="text-md text-gray-500 dark:text-gray-400">{uploadFiles[0].name}</p>
				{:else}
					<div class="flex flex-col items-center w-full h-full">
						<UploadSolid class="mb-3" size="lg" />
						<p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF or PDF</p>
					</div>
				{/if}
				<input 
					type="file"
					id="file-upload"
					name="File Upload"
					class="absolute cursor-pointer top-0 left-0 h-full w-full z-0 opacity-0" 
					bind:this={uploadInput} 
					bind:files={uploadFiles}
				/>
			</button>
		</div>
	</div>
	<svelte:fragment slot="footer">
		<Button>Upload</Button>
		<Button color="alternative" on:click={() => uploadModal = false}>Cancel</Button>
  	</svelte:fragment>
</Modal>
