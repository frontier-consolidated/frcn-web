import { error } from "@sveltejs/kit";

export function invalid(details: object, message = "Invalid request", useError = true) {
	const body = {
		message,
		details
	};

	if (useError) {
		error(400, body);
	}

	return Response.json(body, {
		status: 400
	});
}
