<script lang="ts">
	import { Lexer } from "marked";
	import type { Token, TokenizerStartFunction } from "marked";
	import type { ComponentType, SvelteComponent } from "svelte";

	import Renderer from "./renderer.svelte";

	import type { MarkdownExtension, LevelExtension } from ".";

	export let nowrap: boolean = false;
	export let source: string | Token[];
	export let isInline = false;
	export let disabled: string[] = [];
	export let components: Record<string, ComponentType<SvelteComponent>> = {};
	export let extensions: MarkdownExtension[] = [];

	let tokens: Token[];
	let lexer: Lexer;

	$: preprocessed = Array.isArray(source);
	$: if (preprocessed) {
		tokens = source as Token[];
	} else {
		const blockExtensions = extensions.filter(
			(ext) => "level" in ext && ext.level === "block"
		) as LevelExtension[];
		const inlineExtensions = extensions.filter(
			(ext) => "level" in ext && ext.level === "inline"
		) as LevelExtension[];

		lexer = new Lexer({
			breaks: true,
			gfm: true,
			pedantic: false,
			renderer: null,
			silent: false,
			tokenizer: null,
			extensions: {
				block: blockExtensions.map((ext) => ext.tokenizer),
				startBlock: blockExtensions
					.map((ext) => ext.start)
					.filter((start) => !!start) as TokenizerStartFunction[],
				inline: inlineExtensions.map((ext) => ext.tokenizer),
				startInline: inlineExtensions
					.map((ext) => ext.start)
					.filter((start) => !!start) as TokenizerStartFunction[],
				renderers: {},
				childTokens: {}
			}
		});

		tokens = isInline ? lexer.inlineTokens(source as string) : lexer.lex(source as string);

		const walkExtensions = extensions.filter((ext) => ext.walkTokens);
		for (const ext of walkExtensions) {
			for (const token of tokens) {
				ext.walkTokens!(token);
			}
		}
	}

	$: combinedComponents = {
		...components,
		...Object.fromEntries(
			extensions
				.filter((ext): ext is LevelExtension => !!("renderer" in ext && ext.renderer))
				.map((ext) => [ext.name, ext.renderer!])
		)
	};
</script>

{#if nowrap}
	<Renderer {tokens} {disabled} components={combinedComponents} />
{:else}
	<div {...$$restProps}>
		<Renderer {tokens} {disabled} components={combinedComponents} />
	</div>
{/if}
