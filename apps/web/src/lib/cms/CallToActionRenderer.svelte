<script lang="ts">
	import { CallToActionPreset, type CtaContainer } from "@frcn/cms";

	import { JoinDiscordButton, LoginButton } from "$lib/components";

	export let container: CtaContainer;
	$: preset = container.getPreset();
</script>

{#if preset === CallToActionPreset.JoinDiscord}
	<JoinDiscordButton />
{:else if preset === CallToActionPreset.Login}
	<LoginButton />
{:else}
	<slot {container} />
{/if}
