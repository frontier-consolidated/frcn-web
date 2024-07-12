import { browser } from "$app/environment";
import { locale, waitLocale } from "svelte-i18n";

import "$lib/i18n"; // Import to initialize. Important :)
import { integration } from "$lib/integration.js";

function base64_url_decode(str: string) {
	const base64_encoded = str.replace(/-/g, "+").replace(/_/g, "/");
	const padding = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
	const base64_with_padding = base64_encoded + padding;
	return atob(base64_with_padding).split("").map(char => String.fromCharCode(char.charCodeAt(0))).join("");
}

export const prerender = false;

export const load = async ({ url }) => {
	if (browser) {
		locale.set(window.navigator.language);

		if (url.searchParams.has("login_err")) {
			const encoded_error = url.searchParams.get("login_err")!;
			const decoded_error = base64_url_decode(encoded_error);
			const err = JSON.parse(decoded_error);
			console.error(err);

			url.searchParams.delete("login_err");
		}
	}
	await waitLocale();

	const spectrum_identity = integration.isLoaded() ? await integration.identify() : null;
	// console.log("Spectrum identity", spectrumIdentity)

	return {
		spectrumIdentity: spectrum_identity
	};
};
