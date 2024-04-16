import { browser } from "$app/environment";
import { locale, waitLocale } from "svelte-i18n";

import "$lib/i18n"; // Import to initialize. Important :)
import { integration } from "$lib/integration.js";

function base64URLdecode(str: string) {
	const base64Encoded = str.replace(/-/g, "+").replace(/_/g, "/");
	const padding = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
	const base64WithPadding = base64Encoded + padding;
	return atob(base64WithPadding).split("").map(char => String.fromCharCode(char.charCodeAt(0))).join("");
}

export const prerender = false;

export const load = async ({ url }) => {
	if (browser) {
		locale.set(window.navigator.language);

		if (url.searchParams.has("login_err")) {
			const encodedError = url.searchParams.get("login_err")!;
			const decodedError = base64URLdecode(encodedError);
			const err = JSON.parse(decodedError);
			console.error(err);

			url.searchParams.delete("login_err");
		}
	}
	await waitLocale();

	const spectrumIdentity = integration.isLoaded() ? await integration.identify() : null;
	// console.log("Spectrum identity", spectrumIdentity)

	return {
		spectrumIdentity
	};
};
