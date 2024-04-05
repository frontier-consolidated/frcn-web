<script lang="ts">
	import { Lexer } from "marked";
	import type { Token } from "marked";
	import type { ComponentType, SvelteComponent } from "svelte";

	import Renderer from "./Renderer.svelte";

	export let nowrap: boolean = false;
	export let source: string | Token[];
	export let isInline = false;
	export let disabled: string[] = [];
	export let components: Record<string, ComponentType<SvelteComponent>> = {};

	let tokens: Token[];
	let lexer: Lexer;

	$: preprocessed = Array.isArray(source);
	$: if (preprocessed) {
		tokens = source as Token[];
	} else {
		lexer = new Lexer({
			breaks: true,
			gfm: true,
			pedantic: false,
			renderer: null,
			silent: false,
			tokenizer: null,
		});

		tokens = isInline ? lexer.inlineTokens(source as string) : lexer.lex(source as string);
	}
</script>

{#if nowrap}
	<Renderer {tokens} {disabled} {components} />
{:else}
	<div {...$$restProps}>
		<Renderer {tokens} {disabled} {components} />
	</div>
{/if}
