import * as sitemap from "super-sitemap";

import type { RequestHandler } from "./$types";

import { config } from "$lib/config";

export const GET: RequestHandler = async () => {
	const origin = `https://${config.domain}`;

	return await sitemap.response({
		origin
	});
};
