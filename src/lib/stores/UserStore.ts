import { testUsers } from "$lib/data/testUsers";
import type { User } from "$lib/data/types";
import { writable } from "svelte/store";

export const user = writable<User | null>(testUsers[0]);
export function login() {
	user.set(testUsers[0]);
}
