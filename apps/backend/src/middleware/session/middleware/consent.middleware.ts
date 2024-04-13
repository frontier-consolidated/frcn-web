import * as cookieParser from "cookie";
import type { Request } from "express";

import type { MiddlewareHandler } from "../types";

export function getConsent(req: Request, cookie: string): "reject" | "necessary" | "all" {
    const cookies = req.header("cookie");
    let consentValue: string | undefined = undefined;

    if (req.cookies) {
        consentValue = req.cookies[cookie] as string | undefined;
    } else if (cookies) {
        const parsedCookies = cookieParser.parse(cookies);
        consentValue = parsedCookies[cookie];
    }

    const consentRejected = !consentValue || consentValue === "reject";
    
    if (consentRejected) return "reject";

    const trimmedValue = consentValue!.toLowerCase().trim();
    if (trimmedValue === "necessary") return "necessary";
    return "all";
}

export const middleware: MiddlewareHandler = function ({ consent: config, session, domain }) {
	return function (req, res, next) {
		const consentValue = getConsent(req, config.cookie);
        if (consentValue === "reject") {
            res.clearCookie(session.cookie);
        } else {
            // refresh cookie
            res.cookie(config.cookie, consentValue, {
                maxAge: 400 * 24 * 3600 * 1000,
                domain,
                sameSite: "lax",
                httpOnly: true,
                secure: req.secure
			});
        }

        req.on("end", () => {
            if (getConsent(req, config.cookie) === "reject") {
                req.session.destroy(() => {
                    // we don't care if this fails since the session record will get cleaned up eventually
                });
            }
        });
        next();
	};
};
