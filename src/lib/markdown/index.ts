import type { Token, TokenizerExtension } from "marked";
import type { ComponentType, SvelteComponent } from "svelte";

import Root from "./markdown.svelte";
import Renderer from "./renderer.svelte";

type WalkTokensFn = (token: Token) => void;

export type LevelExtension = TokenizerExtension & {
	walkTokens?: WalkTokensFn;
	renderer?: ComponentType<SvelteComponent>;
};

export type WalkerExtension = {
	name: string;
	walkTokens?: WalkTokensFn;
};

export type MarkdownExtension = LevelExtension | WalkerExtension;

export {
	Root,
	Renderer,
	//
	Root as Markdown,
	Renderer as MarkdownRenderer
};
