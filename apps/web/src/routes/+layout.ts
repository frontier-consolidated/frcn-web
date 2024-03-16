import { browser } from "$app/environment";
import { locale, waitLocale } from "svelte-i18n";

import "$lib/i18n"; // Import to initialize. Important :)
import { integration } from "$lib/integration.js";

export const load = async ({ data }) => {
	if (browser) {
		locale.set(window.navigator.language);
	}
	await waitLocale();

	const spectrumIdentity = integration.isLoaded() ? await integration.identify() : null
	// console.log("Spectrum identity", spectrumIdentity)

	return {
		...data,
		spectrumIdentity
	};
};
