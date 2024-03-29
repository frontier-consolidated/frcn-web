import adapter from "@frcn/adapter";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess({})],

	kit: {
		adapter: adapter({
			out: "build",
			main: {
				input: "server/index.js",
			}
		}),
		prerender: {
			entries: [
				"/legal/cookies",
				"/legal/privacy"
			]
		}
	},
};

export default config;
