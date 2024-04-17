<script lang="ts">
	import { ClipboardSolid } from "flowbite-svelte-icons";

	import Button from "./Button.svelte";

    export let copyText = "";

    let buttonText: string = "Coppy";

    function coppyToClipboard() {
        navigator.clipboard.writeText(copyText).then(
            () => { buttonText = "Copied"; },
            (e) => { buttonText = "There was a Problem"; }
        );
    }
</script>

<Button size="sm" on:click={() => coppyToClipboard()}>
    {buttonText}
    <ClipboardSolid class="me-2 mx-1" tabindex="-1" />
</Button>