import { z } from "zod";

export const Schema = z.object({
	redirect_to: z.string().nullish()
});
