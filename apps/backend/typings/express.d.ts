import type { User as DatabaseUser, AccessKey as DatabaseAccessKey } from "@prisma/client";

export {};

declare global {
	namespace Express {
		interface User extends DatabaseUser { }
		interface AccessKey extends DatabaseAccessKey { }

		interface Request {
			user?: User;
			accessKey?: AccessKey;
			timestamp: Date;

			login(user: User): Promise<void>;
			logout(): Promise<void>;
		}
	}
}
