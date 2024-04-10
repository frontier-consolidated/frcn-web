import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";

export default defineConfig({
	plugins: [sveltekit(), imagetools({
		defaultDirectives: new URLSearchParams({
			format: "webp",
			w: "1000",
			lossless: "true"
		})
	})],
	resolve: {
		mainFields: ["browser", "module", "jsnext:main", "jsnext"],
	},
});
