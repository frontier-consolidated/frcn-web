import { createApp } from "./app";
import { getDomain, getOrigin, getOrigins, getPort } from "./env";

const { server, discordClient } = await createApp({
	origins: getOrigins(),
	sessionConfig: {
		session: {
			domain: getDomain(),
			cookie: process.env.SESSION_COOKIE,
			secret: process.env.SESSION_SECRET,
		},
		deviceTrack: {
			domain: getDomain(),
			cookie: process.env.DEVICE_TRACK_COOKIE,
		},
	},
});

discordClient.login(process.env.DISCORD_TOKEN);

const port = getPort();
server.listen(port, () => {
	console.log(`\n\n  \x1b[32m\x1b[1mAPI ready\x1b[0m

  \x1b[32m➜\x1b[0m\x1b[1m  Local:  \x1b[0m\x1b[36mhttp://localhost:${port}/
  \x1b[32m➜\x1b[0m\x1b[1m  Network:  \x1b[0m\x1b[36m${getOrigin("http")}/\x1b[0m`);
});
