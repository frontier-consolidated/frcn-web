import path from "node:path";
import { fileURLToPath } from "node:url";

import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [
		sveltekit(),
		imagetools({
			defaultDirectives: new URLSearchParams({
				format: "webp",
				lossless: "true"
			})
		})
	],

	build: {
		rollupOptions: {
			external: [path.join(__dirname, "src/lib/data/items.json")]
		}
	}
});
