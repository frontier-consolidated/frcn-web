export {};

declare module "express-session" {
	interface SessionData {
		cookie: Cookie;
		user?: string;
	}
}
