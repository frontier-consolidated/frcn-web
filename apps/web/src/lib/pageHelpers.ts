import type { LinkType } from "flowbite-svelte";

export function getCurrentPage(query: URLSearchParams) {
    const pageNum = Number(query.get("page") ?? "1")
    if (isNaN(pageNum)) return 0;
    return pageNum - 1
}

export function getPageUrl(baseUrl: string | URL, page: number) {
    const url = new URL(baseUrl, "http://host")
    url.searchParams.set("page", `${page}`)
    return url.toString().substring(url.origin.length)
}

export function getPages(baseUrl: string | URL, currentPage: number, itemsPerPage: number, total: number) {
    const pages: LinkType[] = []

    const lastPage = Math.ceil(total / itemsPerPage) - 1

    let startPage = Math.max(0, currentPage - 2)
    const endPage = Math.max(0, Math.min(lastPage, startPage + 4))
    startPage = Math.max(0, Math.min(startPage, endPage - 4))

    for (let p = 0; p < (endPage - startPage + 1); p++) {
        const page = startPage + p;

        pages.push({
            name: `${page + 1}`,
            href: getPageUrl(baseUrl, page + 1),
            active: page === currentPage,
        })
    }

    return pages;
}

export function getPageVars(query: URLSearchParams) {
    let page: number | null = null;
    if (query.has("page")) {
        page = Number(query.get("page"))
        if (isNaN(page)) {
            page = null
        } else {
            page--;
        }
    }

    let limit: number | undefined = undefined;
    if (query.has("limit")) {
        limit = Number(query.get("limit"))
        if (isNaN(limit)) limit = undefined
    }

    return {
        page,
        limit
    }
}