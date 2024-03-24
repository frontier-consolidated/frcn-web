<script lang="ts">
	import type { Token } from "marked";
	import type { ComponentType, SvelteComponent } from "svelte";

	import { renderers } from "./renderers";

	export let disabled: string[] = []
	export let components: Record<string, ComponentType<SvelteComponent>> = {}
	export let tokens: Token[] = [];
	export let token: Token | undefined = undefined;

	function getRenderer(type: string) {
		if (components[type]) return components[type]
		return renderers[type as keyof typeof renderers] as ComponentType<SvelteComponent>;
	}
</script>

{#if !token}
	{#each tokens as token}
		<svelte:self {token} {disabled} {components} />
	{/each}
{:else if token.type in renderers && !disabled.includes(token.type)}
	{#if token.type === "list"}
		<svelte:component this={renderers.list} {token}>
			{#each token.items as item}
				<svelte:component this={renderers.listitem} token={item}>
					<svelte:self tokens={item.tokens} {disabled} {components} />
				</svelte:component>
			{/each}
		</svelte:component>
	{:else if token.type in renderers}
		<svelte:component this={getRenderer(token.type)} {token}>
			{#if "tokens" in token}
				<svelte:self tokens={token.tokens} {disabled} {components} />
			{:else}
				{token.raw}
			{/if}
		</svelte:component>
	{/if}
{/if}
