export function isBrowser() {
    // @ts-expect-error window will not be defined on server
    return typeof window !== "undefined"
}