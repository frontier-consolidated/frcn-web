import { building } from "$app/environment";

import { CmsClient, createCmsClient } from "./client";

let cmsClient: CmsClient | null = null;

export function getCmsClient() {
	if (building) throw new Error("Cannot use CmsClient during build");
	if (!cmsClient) cmsClient = createCmsClient();
	return cmsClient;
}
