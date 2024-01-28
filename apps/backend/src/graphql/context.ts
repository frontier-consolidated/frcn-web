import type { Context } from "../context";

export type GQLContext = {
	user?: Express.User;
	app: Context;
};
