/// <reference types="vite/client" />

import { isBrowser } from "./env";

if (isBrowser()) throw new Error("Attempted to import @frcn/adapter/isr on the client, this is a server-side module")

export function invalidateRoute(pathname: string) {
    if (!import.meta.env.PROD) return;
}