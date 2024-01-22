import { createApp } from "./app";
import { getHostname } from "./utils/urls";

const origins = (process.env.ORIGINS ?? "").split(",");
{
	for (const protocol in ["http", "https"]) {
		if (!origins.includes(getHostname(protocol))) {
			origins.push(getHostname(protocol));
		}
	}
}

const { server, discordClient } = await createApp({
	origins,
	cookieSecret: process.env.COOKIE_SECRET,
	session: {
		domain: process.env.DOMAIN,
		cookie: process.env.SESSION_COOKIE,
		secret: process.env.SESSION_SECRET,
	},
});

discordClient.login(process.env.DISCORD_TOKEN);

const port = Number(process.env.PORT);

server.listen(port, () => {
	console.log(`\n\n  \x1b[32m\x1b[1mAPI ready\x1b[0m

  \x1b[32m➜\x1b[0m\x1b[1m  Local:  \x1b[0m\x1b[36mhttp://localhost:${port}/
  \x1b[32m➜\x1b[0m\x1b[1m  Network:  \x1b[0m\x1b[36m${getHostname("http")}/\x1b[0m`);
});
