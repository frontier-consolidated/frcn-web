import type { User as DatabaseUser } from "@prisma/client";

export {};

declare global {
	namespace Express {
		interface User extends DatabaseUser {}

		interface Request {
			user?: User;

			login(user: User): Promise<void>;
			logout(): Promise<void>;
		}
	}
}
