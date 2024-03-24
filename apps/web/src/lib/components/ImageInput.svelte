<script lang="ts">
	import { TrashBinSolid } from "flowbite-svelte-icons";

    import placeholder from "$lib/images/stock/placeholder.jpg"

    let uploadInput: HTMLInputElement | null = null;
    export let src: string | undefined = undefined;
    export let upload: (file: File) => Promise<void>

	let files: FileList;

	function handleFileKeydown(ev: KeyboardEvent) {
		if (uploadInput && [' ', 'Enter'].includes(ev.key)) {
			ev.preventDefault();
			uploadInput.click();
		}
	}

    $: {
        if (files.length > 0) {
            upload(files[0]).catch(console.error).finally(() => {
                files = new FileList()
            })
        }
    }
</script>

<button
    type="button"
    class="group relative w-full" 
    on:keydown={handleFileKeydown}
>
    <button class="absolute top-4 right-4 rounded p-2 dark:text-white dark:bg-gray-700 dark:hover:bg-red-600">
        <TrashBinSolid />
    </button>
    <img src={files?.length > 0 ? URL.createObjectURL(files[0]) : src ?? placeholder} alt="Preview image of '{files[0].name}' file" class="rounded h-32 group-hover:brightness-110" />
    <input 
        {...$$restProps}
        type="file"
        accept="image/*"
        class="absolute cursor-pointer top-0 left-0 h-full w-full z-0 opacity-0" 
        bind:this={uploadInput} 
        bind:files
    />
</button>