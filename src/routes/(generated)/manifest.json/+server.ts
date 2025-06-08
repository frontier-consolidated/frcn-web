import { config } from "$lib/config";
import { createETag } from "$server/utils/etag";

import type { RequestHandler } from "./$types";

export const prerender = true;

export const GET: RequestHandler = async () => {
	const body = {
		name: config.name,
		short_name: "FRCN",
		start_url: ".",
		display: "minimal-ui",
		theme_color: config.meta.color,
		background_color: "#0d0a15",
		description: config.meta.description,
		orientation: "landscape-primary",
		icons: [
			{
				src: "touch/icon-32.png",
				sizes: "32x32",
				type: "image/png"
			},
			{
				src: "touch/icon-48.png",
				sizes: "48x48",
				type: "image/png"
			},
			{
				src: "touch/icon-96.png",
				sizes: "96x96",
				type: "image/png"
			},
			{
				src: "touch/icon-128.png",
				sizes: "128x128",
				type: "image/png"
			},
			{
				src: "touch/icon-192.png",
				sizes: "192x192",
				type: "image/png"
			},
			{
				src: "favicon.png",
				sizes: "512x512",
				type: "image/png"
			}
		]
	};

	return Response.json(body, {
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, must-revalidate, max-age=0, s-maxage=3600",
			ETag: createETag(JSON.stringify(body))
		}
	});
};
