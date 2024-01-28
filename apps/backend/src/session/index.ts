import { middleware as authMiddleware } from "./middleware/auth.middleware";
import { middleware as deviceTrackMiddleware } from "./middleware/deviceTrack.middleware";
import { middleware as sessionMiddleware } from "./middleware/session.middleware";
import type { SessionMiddlewareConfig } from "./types";

export type * from "./types";

export function sessionMiddlewares(config: SessionMiddlewareConfig) {
	return [sessionMiddleware(config), deviceTrackMiddleware(config), authMiddleware(config)];
}
