import type { UserWithInclude } from "../src/services/users";

export {};

declare global {
	namespace Express {
		interface User extends UserWithInclude {}

		interface Request {
			user?: User;

			login(user: User): Promise<void>;
			logout(): Promise<void>;
		}
	}
}
