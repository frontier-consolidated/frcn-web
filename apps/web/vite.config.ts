import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		exclude: [
			"codemirror",
			"@codemirror/view",
			"@codemirror/state",
			"@codemirror/lang-markdown",
			"@uiw/codemirror-theme-github",
		],
	},
});
