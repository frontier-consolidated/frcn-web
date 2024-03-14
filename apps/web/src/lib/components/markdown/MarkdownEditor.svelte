<script lang="ts">
	import "./overrides.css";
	import { markdown } from "@codemirror/lang-markdown";
	import { githubDarkInit } from "@uiw/codemirror-theme-github";
	import CodeMirror from "svelte-codemirror-editor";
	import { twMerge } from "tailwind-merge";

	export let value: string = "";
</script>

<CodeMirror
	bind:value
	basic={false}
	lineWrapping
	extensions={[markdown()]}
	theme={githubDarkInit({
		settings: {
			background: "#374151",
			foreground: "#ffffff",
			fontFamily: "inherit",
		},
	})}
	{...$$restProps}
	class={twMerge("w-full rounded border border-gray-200 dark:border-gray-600 text-sm focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 overflow-hidden overflow-y-auto resize-y", $$restProps.class)}
/>
