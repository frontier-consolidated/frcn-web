import type { Request } from "express";

import type { Context } from "../context";

export type GQLContext = {
	user?: Express.User;
	accesskey?: Express.AccessKey;
	app: Context;
	req: Request;
};
