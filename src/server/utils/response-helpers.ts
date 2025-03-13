import { error } from "@sveltejs/kit";

export function invalid(details: object, message = "Invalid request", use_error = true) {
	const body = {
		message,
		details
	};

	if (use_error) {
		error(400, body);
	}

	return Response.json(body, {
		status: 400
	});
}
