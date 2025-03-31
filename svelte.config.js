import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";
import remarkCustomHeaderId from "remark-custom-header-id";
import remarkSectionize from "remark-sectionize";

/** @type {import('@sveltejs/kit').Config}*/
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		mdsvex({
			layout: {
				legal: "./src/routes/(legal)/svx-layout.svelte"
			},
			remarkPlugins: [remarkCustomHeaderId, remarkSectionize]
		})
	],
	extensions: [".svelte", ".svx"],

	kit: {
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			out: "build",
			precompress: true
		}),
		alias: {
			$server: "src/lib/server",
			$result: "src/result"
		}
	}
};

export default config;
