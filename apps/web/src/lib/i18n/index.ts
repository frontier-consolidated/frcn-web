import { init } from "svelte-i18n";

import { browser } from "$app/environment";

const defaultLocale = "en";

// register("en", () => import("./lang/en.json"))

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale
});
