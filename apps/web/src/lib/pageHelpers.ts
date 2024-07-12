import type { LinkType } from "flowbite-svelte";

export function get_current_page(query: URLSearchParams) {
    const page_num = Number(query.get("page") ?? "1");
    if (isNaN(page_num)) return 0;
    return page_num - 1;
}

export function get_page_url(base_url: string | URL, page: number) {
    const url = new URL(base_url, "http://host");
    url.searchParams.set("page", `${page}`);
    return url.toString().substring(url.origin.length);
}

export function get_pages(base_url: string | URL, current_page: number, items_per_page: number, total: number) {
    const pages: LinkType[] = [];

    const last_page = Math.ceil(total / items_per_page) - 1;

    let start_page = Math.max(0, current_page - 2);
    const end_page = Math.max(0, Math.min(last_page, start_page + 4));
    start_page = Math.max(0, Math.min(start_page, end_page - 4));

    for (let p = 0; p < (end_page - start_page + 1); p++) {
        const page = start_page + p;

        pages.push({
            name: `${page + 1}`,
            href: get_page_url(base_url, page + 1),
            active: page === current_page,
        });
    }

    return pages;
}

export function get_page_vars(query: URLSearchParams) {
    let page: number | null = null;
    if (query.has("page")) {
        page = Number(query.get("page"));
        if (isNaN(page)) {
            page = null;
        } else {
            page--;
        }
    }

    let limit: number | undefined = undefined;
    if (query.has("limit")) {
        limit = Number(query.get("limit"));
        if (isNaN(limit)) limit = undefined;
    }

    return {
        page,
        limit
    };
}