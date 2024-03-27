<script lang="ts">
	import { DiscordSolid } from "flowbite-svelte-icons";

	import { DISCORD_URL } from "$lib/constants";

	import Button from "./Button.svelte";
</script>

<Button size="lg" class="transition-[padding] bg-discord dark:bg-discord hover:bg-discord-pressed dark:hover:bg-discord-pressed px-8 hover:px-10" href={DISCORD_URL}>
    <DiscordSolid class="me-2" tabindex="-1" /> JOIN DISCORD
</Button>