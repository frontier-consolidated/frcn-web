import { writable } from "svelte/store";

export const cookieConsentModal = writable<boolean>(false);
