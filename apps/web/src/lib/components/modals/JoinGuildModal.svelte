<script lang="ts">
	import { browser } from "$app/environment";
	import { Modal } from "flowbite-svelte";
	import { queryParam } from "sveltekit-search-params";

	import JoinDiscordButton from "../JoinDiscordButton.svelte";

	const notInGuild = browser ? queryParam("not_in_guild") : null;
</script>

<Modal
	id="join-guild-modal"
	open={!!$notInGuild}
	class="clip-tl-br-8 rounded"
	bodyClass="space-y-2 px-10"
	size="xs"
	on:close={() => {
		notInGuild?.set(null);
	}}
>
	<span class="block font-medium text-xl text-center text-gray-800 dark:text-white"
		>Join our Discord!</span
	>
	<p>
		Due to security reasons we require you to be a member of our Discord server before you can
		login to this site.
	</p>
	<div class="flex justify-center">
		<JoinDiscordButton />
	</div>
</Modal>
