<script lang="ts">
	import { browser } from "$app/environment";
	import { Spinner } from "flowbite-svelte";

	import { login, user } from "$lib/stores/UserStore";

	import Button from "./Button.svelte";

    export let spinner = false;
</script>

<Button
    size="sm"
    class="px-8 hidden sm:!block"
    on:click={() => {
        if ($user.loading) return;
        login().catch(console.error);
    }}
>
    {#if spinner && ($user.loading || !browser)}
        <Spinner class="me-2" size="4" color="white" />
    {/if}
    LOGIN
</Button>