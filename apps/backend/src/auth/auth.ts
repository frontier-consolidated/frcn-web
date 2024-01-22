import { NextFunction, Response, Request } from "express";
import { users } from "../services/users";

export function authMiddleware() {
	return async function (req: Request, res: Response, next: NextFunction) {
		req.login = async (user) => {
			req.user = user;
			req.session.user = user.id;

			await new Promise<void>((resolve, reject) => {
				req.session.save((err) => {
					if (err) return reject(err);
					resolve();
				});
			});
		};

		req.logout = async () => {
			delete req.user;
			req.session.user = null;

			await new Promise<void>((resolve, reject) => {
				req.session.save((err) => {
					if (err) return reject(err);
					resolve();
				});
			});
		};

		if (req.session.user) {
			const user = await users.getUser(req.session.user);
			if (!user) {
				delete req.session.user;
			} else {
				req.user = user;
			}
		}

		next();
	};
}
