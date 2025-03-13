<script lang="ts">
	import type { Token } from "marked";
	import { getContext, setContext, type ComponentType, type SvelteComponent } from "svelte";

	import { renderers } from "./renderers";

	export let useContext: boolean = false;
	export let disabled: string[] = [];
	export let components: Record<string, ComponentType<SvelteComponent>> = {};
	export let tokens: Token[] = [];
	export let token: Token | undefined = undefined;

	if (useContext) {
		const ctx = getContext("md-renderer") as {
			disabled: string[];
			components: Record<string, ComponentType<SvelteComponent>>;
		};

		if (ctx) {
			disabled = ctx.disabled;
			components = ctx.components;
		}
	}

	function get_renderer(type: string) {
		if (components[type]) return components[type];
		return renderers[type as keyof typeof renderers] as ComponentType<SvelteComponent>;
	}

	$: setContext("md-renderer", {
		disabled,
		components
	});

	$: renderer = token ? get_renderer(token.type) : null;
</script>

{#if !token}
	{#each tokens as token}
		<svelte:self {token} {disabled} {components} />
	{/each}
{:else if renderer && !disabled.includes(token.type)}
	{#if token.type === "list"}
		<svelte:component this={renderers.list} {token}>
			{#each token.items as item}
				<svelte:component this={renderers.listitem} token={item}>
					<svelte:self tokens={item.tokens} {disabled} {components} />
				</svelte:component>
			{/each}
		</svelte:component>
	{:else if token.type === "table"}
		<svelte:component this={renderers.table}>
			<svelte:component this={renderers.tablerow} slot="header">
				{#each token.header as header, i}
					<svelte:component this={renderers.tablecell} token={header} align={token.align[i]}>
						<svelte:self tokens={header.tokens} {disabled} {components} />
					</svelte:component>
				{/each}
			</svelte:component>
			{#each token.rows as row}
				<svelte:component this={renderers.tablerow}>
					{#each row as item, i}
						<svelte:component this={renderers.tablecell} token={item} align={token.align[i]}>
							<svelte:self tokens={item.tokens} {disabled} {components} />
						</svelte:component>
					{/each}
				</svelte:component>
			{/each}
		</svelte:component>
	{:else}
		<svelte:component this={renderer} {token}>
			{#if "tokens" in token}
				<svelte:self tokens={token.tokens} {disabled} {components} />
			{:else if token.type === "text"}
				{token.raw}
			{:else if token.type === "escape"}
				{token.text}
			{/if}
		</svelte:component>
	{/if}
{/if}
