import type { RequestEvent } from "@sveltejs/kit";

import { config } from "./config.server";

// :: Copy from https://github.com/sveltejs/kit/blob/f67898d25ee32e9377221979d2a9e6b792786f4e/packages/kit/src/utils/http.js#L57-L79
function is_content_type(request: Request, ...types: string[]) {
	const type = request.headers.get("content-type")?.split(";", 1)[0].trim() ?? "";
	return types.includes(type.toLowerCase());
}

export function is_form_content_type(request: Request) {
	// These content types must be protected against CSRF
	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/enctype
	return is_content_type(
		request,
		"application/x-www-form-urlencoded",
		"multipart/form-data",
		"text/plain"
	);
}
// :: End of Copy

export function csrf_handler(event: RequestEvent) {
	if (!config.allowed_form_routes.includes(event.url.pathname)) {
		const request = event.request;

		const forbidden =
			is_form_content_type(request) &&
			(request.method === "POST" ||
				request.method === "PUT" ||
				request.method === "PATCH" ||
				request.method === "DELETE") &&
			request.headers.get("origin") !== event.url.origin;

		if (forbidden) {
			if (request.headers.get("accept") === "application/json") {
				return Response.json(
					{
						message: `Cross-site ${request.method} form submissions are forbidden`
					},
					{ status: 403 }
				);
			}
			return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
				status: 403
			});
		}
	}

	return null;
}
