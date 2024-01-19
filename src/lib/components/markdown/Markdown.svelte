<script lang="ts">
	import { Lexer } from "marked";
	import type { Token } from "marked";
	import Renderer from "./Renderer.svelte";

	export let source: string | Token[];
	export let isInline = false;

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
		// console.log(source, tokens);
	}
</script>

<div {...$$restProps}>
	<Renderer {tokens} />
</div>
