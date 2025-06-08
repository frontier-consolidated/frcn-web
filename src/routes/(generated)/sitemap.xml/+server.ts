import * as sitemap from "super-sitemap";

import { config } from "$lib/config";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
	const origin = `https://${config.domain}`;

	return await sitemap.response({
		origin
	});
};
