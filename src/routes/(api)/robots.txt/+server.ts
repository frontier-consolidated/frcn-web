import type { RequestHandler } from "./$types";

import { config } from "$lib/config";
import { create_etag } from "$server/utils/etag";

export const prerender = true;

export const GET: RequestHandler = async () => {
	const body = `Sitemap: https://${config.domain}/sitemap.xml

# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow: /oauth/
Disallow: /logout
Disallow: /upload
Disallow: /items.json`;

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain",
			"Cache-Control": "public, must-revalidate, max-age=0, s-maxage=3600",
			ETag: create_etag(body)
		}
	});
};
