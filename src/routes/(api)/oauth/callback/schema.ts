import { z } from "zod";

export const Schema = z.union([
	z.object({
		code: z.string().min(1, "Parameter is required"),
		client_info: z.string().min(1, "Parameter is required"),
		state: z.string().nullish()
	}),
	z.object({
		error: z.string().min(1, "Expected error"),
		error_description: z.string().nullish()
	})
]);
