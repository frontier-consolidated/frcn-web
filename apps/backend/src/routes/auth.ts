import { REST, Routes, RESTPostOAuth2AccessTokenResult, APIUser } from "discord.js";

import { Context } from "../context";
import { getHostname } from "../env";
import { $users } from "../services/users";

export default function route(context: Context) {
	const clientId = process.env.DISCORD_CLIENTID;
	const clientSecret = process.env.DISCORD_SECRET;
	const scope = ["identify"];

	context.expressApp.get("/oauth", (req, res) => {
		const { success_uri, failed_uri } = req.query as {
			failed_uri: string;
			success_uri: string;
		};

		const state = Buffer.from(
			JSON.stringify({
				success_uri,
				failed_uri,
			}),
			"utf-8"
		).toString("base64");

		const params = new URLSearchParams({
			client_id: clientId,
			redirect_uri: `${getHostname(req.protocol)}/oauth/callback`,
			response_type: "code",
			scope,
			state,
		});
		const redirectUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
		res.redirect(redirectUrl);
	});

	context.expressApp.get("/oauth/callback", async (req, res, next) => {
		const { code, state } = req.query as { code?: string; state?: string };

		const { success_uri, failed_uri } = JSON.parse(
			Buffer.from(state, "base64").toString("utf-8")
		) as {
			failed_uri: string;
			success_uri: string;
		};

		if (!code) {
			res.redirect(failed_uri ?? "/");
			return;
		}

		try {
			const authToken = (await context.discordRest.post(Routes.oauth2TokenExchange(), {
				body: new URLSearchParams({
					client_id: clientId,
					client_secret: clientSecret,
					redirect_uri: `${getHostname(req.protocol)}/oauth/callback`,
					grant_type: "authorization_code",
					scope,
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

			const user = await $users.getOrCreateUser(discordUser);
			await req.login(user);
		} catch (err) {
			next(err);
			return;
		}

		res.redirect(success_uri ?? "/");
	});

	context.expressApp.get("/logout", async (req, res) => {
		await req.logout();
		res.sendStatus(200);
	});
}
