<script lang="ts">
	import { browser } from "$app/environment";
	import { Spinner } from "flowbite-svelte";
	import { twMerge } from "tailwind-merge";

	import { login, user } from "$lib/stores/UserStore";

	import Button from "./Button.svelte";

	export let spinner = false;
</script>

<Button
	{...$$restProps}
	size="sm"
	class={twMerge("px-8", $$restProps.class)}
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
