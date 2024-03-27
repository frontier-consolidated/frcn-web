import { isr } from "MANIFEST";

const isrCache = new Map<string, boolean>()

export function is_isr_rendered(pathname: string) {
    return isr.has(pathname);
}

export function is_isr_valid(pathname: string) {
    return isrCache.has(pathname) && isrCache.get(pathname)
}

export function is_prerender_valid(pathname: string) {
    if (!is_isr_rendered(pathname)) return true;
    return is_isr_valid(pathname);
}