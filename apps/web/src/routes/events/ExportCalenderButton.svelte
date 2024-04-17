<script lang="ts">
	import { FileExportSolid } from "flowbite-svelte-icons";

	import { CalenderIcsExportModal } from "$lib/components";
	import { Button } from "$lib/components";

    let calenderIcsExportModal = false;
</script>

<Button color="alternative" class="md:flex-1 sm:shrink-0" on:click={() => { calenderIcsExportModal = true; }}>
    <FileExportSolid class="me-2 outline-none" tabindex="-1" /> Export
</Button>

<CalenderIcsExportModal bind:open={calenderIcsExportModal} />

