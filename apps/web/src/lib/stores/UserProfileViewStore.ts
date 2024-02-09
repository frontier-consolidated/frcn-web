import { writable } from "svelte/store";

import type { UserFragmentFragment } from "$lib/graphql/__generated__/graphql";

export const userProfileView = writable<UserFragmentFragment | null>(null);
