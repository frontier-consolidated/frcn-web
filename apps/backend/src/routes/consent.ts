import type { Context, RouteConfig } from "../context";
import { getDomain } from "../env";

export default function route(context: Context, config: RouteConfig) {
	context.expressApp.put("/consent", (req, res) => {
		let { action } = req.body as {
			action?: "reject" | "necessary" | "all";
		};

		action ??= "reject";
		if (action === "reject") {
			res.clearCookie(config.consent.cookie);
		} else {
			const trimmedAction = action.toLowerCase().trim();
			if (!["necessary", "all"].includes(trimmedAction)) {
				return res.sendStatus(400);
			}
			res.cookie(config.consent.cookie, trimmedAction, {
				maxAge: 400 * 24 * 3600 * 1000,
				domain: getDomain(true),
				sameSite: "lax",
				httpOnly: true,
				secure: req.secure
			});
		}
		res.sendStatus(200);
	});
}
