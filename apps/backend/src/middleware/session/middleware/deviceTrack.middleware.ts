import { randomUUID } from "crypto";

import { getConsent } from "./consent.middleware";
import type { MiddlewareHandler } from "../types";

function serialize(value: string) {
	return `d:${Buffer.from(value, "utf-8").toString("base64")}`;
}

function deserialize(cookie: string) {
	const [identifier, value] = cookie.split(":");
	if (identifier != "d") return null;
	return Buffer.from(value, "base64").toString("utf-8");
}

export const middleware: MiddlewareHandler = function ({ deviceTrack, consent, domain }) {
	return function (req, res, next) {
		const consentValue = getConsent(req, consent.cookie);
		if (consentValue === "reject") {
			res.clearCookie(deviceTrack.cookie);
			return next();
		}

		function setCookie(value: string) {
			res.cookie(deviceTrack.cookie, serialize(value), {
				domain,
				maxAge: 365 * 24 * 3600 * 1000,
				httpOnly: true,
				secure: req.secure,
				sameSite: "lax"
			});
		}

		const deviceCookie = req.cookies[deviceTrack.cookie] as string | undefined;

		if (deviceCookie) {
			const deviceId = deserialize(deviceCookie);
			if (deviceId) {
				if (req.session.deviceId && req.session.deviceId === deviceId) {
					next();
					return;
				}

				if (!req.session.deviceId) {
					req.session.deviceId = deviceId;
					next();
					return;
				}
			}
		}

		if (!deviceCookie && req.session.deviceId) {
			setCookie(req.session.id);
			next();
			return;
		}

		const newDeviceId = randomUUID();
		req.session.deviceId = newDeviceId;
		setCookie(newDeviceId);
		next();
	};
};
