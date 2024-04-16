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

			id: string;
			remoteIp: string;
			isLocal: boolean;
			rateLimit: {
				limit: number;
				used: number;
				remaining: number;
				resetTime: Date;
			}

			login(user: User): Promise<void>;
			logout(): Promise<void>;
		}
	}
}
