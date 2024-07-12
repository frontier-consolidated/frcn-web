import { writable } from "svelte/store";

export const cookie_consent_modal = writable<boolean>(false);