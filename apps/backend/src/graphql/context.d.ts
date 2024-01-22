import type { RouteContext } from "../routeContext";

export type Context = {
	user?: Express.User;
	appContext: RouteContext;
};
