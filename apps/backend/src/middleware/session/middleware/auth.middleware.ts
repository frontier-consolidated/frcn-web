import { getConsent } from "./consent.middleware";
import { $users } from "../../../services/users";
import type { MiddlewareHandler } from "../types";

export const middleware: MiddlewareHandler = function ({ consent }) {
	return async function (req, res, next) {
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
			delete req.session.user;

			await new Promise<void>((resolve, reject) => {
				req.session.save((err) => {
					if (err) return reject(err);
					resolve();
				});
			});
		};

		const consentValue = getConsent(req, consent.cookie)
		
		if (req.session.user && consentValue !== "reject") {
			const user = await $users.getUser(req.session.user);
			if (!user) {
				delete req.session.user;
			} else {
				req.user = user;
			}
		}

		next();
	};
};
