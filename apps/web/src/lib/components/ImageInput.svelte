<script lang="ts">
	import { TrashBinSolid } from "flowbite-svelte-icons";
	import { twMerge } from "tailwind-merge";

    import placeholder from "$lib/images/stock/placeholder.jpg"

    let uploadInput: HTMLInputElement | null = null;
    export let src: string | undefined = undefined;
    export let upload: (file: File) => Promise<void>
    export let remove: () => Promise<void>

	let files: FileList;
    let uploading = false;

	function handleFileKeydown(ev: KeyboardEvent) {
		if (uploadInput && [' ', 'Enter'].includes(ev.key)) {
			ev.preventDefault();
			uploadInput.click();
		}
	}

    $: {
        if (files && files.length > 0 && !uploading) {
            uploading = true;
            upload(files[0]).catch(console.error).finally(() => {
                if (uploadInput) uploadInput.value = ""
                uploading = false;
            })
        }
    }
</script>

<button
    type="button"
    class={twMerge("group relative max-w-lg", $$restProps.class)} 
    on:keydown={handleFileKeydown}
>
    <img src={(files?.length ?? 0) > 0 ? URL.createObjectURL(files[0]) : src ?? placeholder} alt="Input preview" class="rounded w-full group-hover:brightness-110" />
    <input 
        {...$$restProps}
        type="file"
        accept="image/*"
        class="absolute cursor-pointer top-0 left-0 h-full w-full z-0 opacity-0" 
        bind:this={uploadInput} 
        bind:files
    />
    {#if (files?.length ?? 0) > 0 || src}
        <button class="absolute top-4 right-4 rounded p-2 dark:text-white dark:bg-gray-700 dark:hover:bg-red-600" on:click={async (e) => {
            e.stopPropagation()
            if (src) {
                await remove()
            } else if (uploadInput) {
                uploadInput.value = ""
            }
        }}>
            <TrashBinSolid />
        </button>
    {/if}
</button>