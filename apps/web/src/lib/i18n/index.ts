import { browser } from "$app/environment";
import { init } from "svelte-i18n";

const default_locale = "en";

// register("en", () => import("./lang/en.json"))

init({
	fallbackLocale: default_locale,
	initialLocale: browser ? window.navigator.language : default_locale,
});
