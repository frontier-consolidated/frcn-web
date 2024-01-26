import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		mainFields: ["browser", "module", "jsnext:main", "jsnext"],
	},
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
