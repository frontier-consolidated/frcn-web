<script lang="ts">
	import { browser } from "$app/environment";
	import { indentWithTab } from "@codemirror/commands";
	import { markdown } from "@codemirror/lang-markdown";
	import { indentUnit } from "@codemirror/language";
	import { EditorState, StateEffect, type Extension } from "@codemirror/state";
	import { EditorView, keymap, placeholder as placeholderExt, type KeyBinding } from "@codemirror/view";
	import { Autolink, Strikethrough, Emoji } from "@lezer/markdown";
	import { Spinner } from "flowbite-svelte";
	import { createEventDispatcher, getContext, onDestroy, onMount } from "svelte";
	import { twMerge } from "tailwind-merge";

	import { Underline } from "./extensions";
	import { darkTheme } from "./theme/dark";

	export let value = "";
	
	export let tabSize = 2;
	export let disabled = false;
	export let placeholder: string | undefined = undefined;

	let clazz = "";
	export { clazz as class };

	const dispatch = createEventDispatcher();

	let element: HTMLDivElement;
	let view: EditorView;
	let update_from_prop = false;
	let update_from_state = false;
	let first_config = true;
	let first_update = true;

	let background = getContext("background");
	
	$: state_extensions = [
		indentUnit.of(" ".repeat(tabSize)),
		keymap.of([indentWithTab] as readonly KeyBinding[]),
		EditorView.editable.of(!disabled),
		EditorState.readOnly.of(disabled),
		EditorView.lineWrapping,
		placeholder ? placeholderExt(placeholder) : undefined,
		markdown({
			completeHTMLTags: true,
			addKeymap: true,
			extensions: [
				Strikethrough,
				Underline,
				Autolink,
				Emoji
			]
		}),
		darkTheme,
	].filter((e): e is Extension => !!e);
	$: view && update(value);
	$: view && state_extensions && reconfigure();

	onMount(() => view = createEditorView());
	onDestroy(() => view?.destroy());

	function createEditorView() {
	  return new EditorView({
		parent: element,
		state: createEditorState(value),
		dispatch(transaction) {
		  view.update([transaction]);
		  if (!update_from_prop && transaction.docChanged) {
			handleChange();
		  }
		}
	  });
	}

	function reconfigure() {
	  if (first_config) {
		first_config = false;
		return;
	  }
	  view.dispatch({
		effects: StateEffect.reconfigure.of(state_extensions)
	  });
	}

	function update(newValue: string) {
	  if (first_update) {
		first_update = false;
		return;
	  }
	  if (update_from_state) {
		update_from_state = false;
		return;
	  }
	  update_from_prop = true;
	  view.setState(createEditorState(newValue));
	  update_from_prop = false;
	}

	function handleChange() {
	  const new_value = view.state.doc.toString();
	  if (new_value === value)
		return;
	  update_from_state = true;
	  value = new_value;

	  dispatch("change", value);
	}
	
	function createEditorState(newValue: string) {
	  return EditorState.create({
		doc: newValue ?? undefined,
		extensions: state_extensions
	  });
	}

	let paddingClass = "[&_.cm-editor]:p-2.5 [&_.cm-editor]:h-full [&_.cm-content]:p-0 [&_.cm-line]:pl-0";
	let placeholderClass = "[&_.cm-placeholder]:text-gray-400";
	let urlClass = "[&_.ͼurl]:text-primary-600 dark:[&_.ͼurl]:text-primary-500";
	let divClass = twMerge("w-full rounded border border-gray-200 dark:border-gray-600 text-sm focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 overflow-hidden overflow-y-auto resize-y bg-gray-50 text-gray-900 dark:text-white", background ? "dark:bg-gray-600" : "dark:bg-gray-700", paddingClass, placeholderClass, urlClass, clazz);
</script>

{#if browser}
	<div class={twMerge("codemirror-wrapper", divClass)} bind:this={element} {...$$restProps} />
{:else}
	<div class={twMerge("relative", divClass)} {...$$restProps}>
		<Spinner class="m-auto" />

		<pre class="scm-pre cm-editor">{value}</pre>
	</div>
{/if}

<style>
	.codemirror-wrapper :global(.cm-focused) {
		outline: none;
	}

	.scm-pre {
		font-size: 0.85rem;
		font-family: monospace;
		tab-size: 2;
		-moz-tab-size: 2;
		resize: none;
		pointer-events: none;
		user-select: none;
		overflow: auto;
	}
</style>