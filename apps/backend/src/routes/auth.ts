
import { REST, Routes, type RESTPostOAuth2AccessTokenResult, type APIUser } from "discord.js";

import type { Context, RouteConfig } from "../context";
import { getAdminIds, getURL } from "../env";
import { getConsent } from "../middleware/session/middleware/consent.middleware";
import { $discord } from "../services/discord";
import { $users } from "../services/users";

export default function route(context: Context, config: RouteConfig) {
	const clientId = config.auth.clientId;
	const clientSecret = config.auth.clientSecret;
	const scope = ["identify"];

	context.expressApp.get("/oauth", (req, res) => {
		const { redirect_uri } = req.query as {
			redirect_uri?: string;
		};

		const consentValue = getConsent(req, config.consent.cookie);
		if (consentValue === "reject") {
			if (!redirect_uri) {
				return res.status(400).send({
					message: "Missing consent"
				});
			}
			const url = new URL(redirect_uri);
			url.searchParams.set("missing_consent", "true");
			return res.redirect(url.toString());
		}

		const state = Buffer.from(
			JSON.stringify({
				redirect_uri,
			}),
			"utf-8"
		).toString("base64url");

		const params = new URLSearchParams({
			client_id: clientId,
			redirect_uri: getURL(req.protocol, "/oauth/callback").href,
			response_type: "code",
			scope: scope.join(","),
			state,
		});
		const redirectUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
		res.redirect(redirectUrl);
	});

	context.expressApp.get("/oauth/callback", async (req, res) => {
		const { code, state } = req.query as { code?: string; state?: string };

		const { redirect_uri } = (state ? JSON.parse(
			Buffer.from(state, "base64url").toString("utf-8")
		) : {}) as {
			redirect_uri?: string;
		};

		if (!code) {
			if (!redirect_uri) {
				return res.status(400).send({
					message: "Missing oauth code"
				});
			}
			const url = new URL(redirect_uri);
			url.searchParams.set("login_err", Buffer.from(JSON.stringify({
				error: "Missing oauth code"
			})).toString("base64url"));
			return res.redirect(url.toString());
		}

		try {
			const authToken = (await context.discordRest.post(Routes.oauth2TokenExchange(), {
				body: new URLSearchParams({
					client_id: clientId,
					client_secret: clientSecret,
					redirect_uri: getURL(req.protocol, "/oauth/callback").href,
					grant_type: "authorization_code",
					scope: scope.join(","),
					code,
				}).toString(),
				passThroughBody: true,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			})) as RESTPostOAuth2AccessTokenResult;

			const rest = new REST({ version: "10" }).setToken(authToken.access_token);
			const discordUser = (await rest.get(Routes.user("@me"), {
				auth: true,
				authPrefix: "Bearer",
			})) as APIUser;

			const adminIds = getAdminIds();
			if (!adminIds.includes(discordUser.id) && !(await $discord.isInGuild(context.discordClient, discordUser.id))) {
				if (!redirect_uri) {
					return res.status(400).send({
						message: "Not in guild"
					});
				}
				const url = new URL(redirect_uri);
				url.searchParams.set("not_in_guild", "true");
				return res.redirect(url.toString());
			}

			const user = await $users.getOrCreateUser(discordUser, context.discordClient);
			await $users.syncRoles(context.discordClient, user);
			
			await req.login(user);
		} catch (err) {
			if (!redirect_uri) {
				return res.status(400).send({
					message: (err as Error).message
				});
			}
			const url = new URL(redirect_uri);
			url.searchParams.set("login_err", Buffer.from(JSON.stringify({
				error: (err as Error).message
			})).toString("base64url"));
			return res.redirect(url.toString());
		}

		res.redirect(redirect_uri ?? "/");
	});

	context.expressApp.get("/logout", async (req, res) => {
		await req.logout();
		res.sendStatus(200);
	});
}
