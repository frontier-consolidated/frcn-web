<script lang="ts">
	import type { Token } from "marked";

	import { renderers } from "./renderers";

	export let tokens: Token[] = [];
	export let token: Token | undefined = undefined;

	function getRenderer(type: string) {
		return renderers[type as keyof typeof renderers] as any;
	}
</script>

{#if !token}
	{#each tokens as token}
		<svelte:self {token} />
	{/each}
{:else if token.type in renderers}
	{#if token.type === "list"}
		<svelte:component this={renderers.list} {token}>
			{#each token.items as item}
				<svelte:component this={renderers.listitem} token={item}>
					<svelte:self tokens={item.tokens} />
				</svelte:component>
			{/each}
		</svelte:component>
	{:else if token.type in renderers}
		<svelte:component this={getRenderer(token.type)} {token}>
			{#if "tokens" in token}
				<svelte:self tokens={token.tokens} />
			{:else}
				{token.raw}
			{/if}
		</svelte:component>
	{/if}
{/if}
