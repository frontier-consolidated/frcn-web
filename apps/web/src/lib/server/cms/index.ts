import { building } from "$app/environment";

import { CmsClient, create_cms_client } from "./client";

let cms_client: CmsClient | null = null;

export function get_cms_client() {
    if (building) throw new Error("Cannot use CmsClient during build");
    if (!cms_client) cms_client = create_cms_client();
    return cms_client;
}
