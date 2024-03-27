/// <reference types="vite/client" />

import path from "path";
import { fileURLToPath } from "url";

import { RequestEvent, ResolveOptions } from "@sveltejs/kit";

import { isBrowser } from "./env";

if (isBrowser()) throw new Error("Attempted to import @frcn/adapter/isr on the client, this is a server-side module")

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function invalidateRoute(pathname: string) {
    if (!import.meta.env.PROD) return;

    console.log("Invalidating route...")
    const { invalidate_isr_route } = await import(/* @vite-ignore */ path.join(__dirname, "../../", "handler.js"))
    invalidate_isr_route(pathname);
}

export function createPageProcessor(event: RequestEvent, building?: boolean): ResolveOptions["transformPageChunk"] {
    if (building || !import.meta.env.PROD || event.isDataRequest) return undefined;

    let buffer = ""
    return function transformPageChunk({ html, done }) {
        buffer += html;
        if (done) {
            console.log("page path:", event.url.pathname)

            return buffer;
        }
    }
}