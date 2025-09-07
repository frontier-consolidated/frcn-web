<script lang="ts">
	import { TrashBinSolid } from "flowbite-svelte-icons";
	import { twMerge } from "tailwind-merge";

	import placeholder from "$lib/images/stock/placeholder.jpg";

	let uploadInput: HTMLInputElement | null = null;
	export let src: string | undefined = undefined;
	export let upload: (file: File) => void | Promise<void>;
	export let remove: (() => Promise<void>) | undefined = undefined;

	let files: FileList;
	let uploading = false;

	function handleFileKeydown(ev: KeyboardEvent) {
		if (uploadInput && [" ", "Enter"].includes(ev.key)) {
			ev.preventDefault();
			uploadInput.click();
		}
	}

	$: {
		if (files && files.length > 0 && !uploading) {
			uploading = true;
			Promise.resolve(upload(files[0]))
				.catch(console.error)
				.finally(() => {
					if (uploadInput) uploadInput.value = "";
					uploading = false;
				});
		}
	}
</script>

<button
	type="button"
	class={twMerge("group relative max-w-lg", $$restProps.class)}
	on:keydown={handleFileKeydown}
>
	<img
		src={(files?.length ?? 0) > 0 ? URL.createObjectURL(files[0]) : (src ?? placeholder)}
		alt="Input preview"
		class="w-full rounded group-hover:brightness-110"
	/>
	<input
		{...$$restProps}
		type="file"
		accept="image/*"
		class="absolute left-0 top-0 z-0 h-full w-full cursor-pointer opacity-0"
		bind:this={uploadInput}
		bind:files
	/>
	{#if remove && ((files?.length ?? 0) > 0 || src)}
		<button
			class="absolute right-4 top-4 rounded p-2 dark:bg-gray-700 dark:text-white dark:hover:bg-red-600"
			on:click={async (e) => {
				if (!remove) return;
				e.stopPropagation();
				if (src) {
					await remove();
				} else if (uploadInput) {
					uploadInput.value = "";
				}
			}}
		>
			<TrashBinSolid />
		</button>
	{/if}
</button>
