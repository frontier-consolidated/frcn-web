import { z } from "zod";

export const Schema = z.object({
	redirect_uri: z.string().nullish()
});
