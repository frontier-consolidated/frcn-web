import { createApp } from "./app";
import { seedDatabase } from "./database";
import { getDomain, getOrigin, getOrigins, getPort, validateEnvironment } from "./env";

process.env.NODE_ENV ??= "development"
validateEnvironment()

await seedDatabase()

const { server, discordClient } = await createApp({
	origins: getOrigins(),
	routeConfig: {
		auth: {
			clientId: process.env.DISCORD_CLIENTID,
			clientSecret: process.env.DISCORD_SECRET
		},
		consent: {
			cookie: process.env.CONSENT_COOKIE
		},
		files: {
			bucketName: process.env.AWS_S3_BUCKET,
		}
	},
	sessionConfig: {
		domain: getDomain(),
		consent: {
			cookie: process.env.CONSENT_COOKIE
		},
		session: {
			cookie: process.env.SESSION_COOKIE,
			secret: process.env.SESSION_SECRET,
		},
		deviceTrack: {
			cookie: process.env.DEVICE_TRACK_COOKIE,
		},
	},
	discordConfig: {
		token: process.env.DISCORD_TOKEN
	},
	s3Config: {
		bucketName: process.env.AWS_S3_BUCKET,
		region: process.env.AWS_S3_REGION,
		clientKey: process.env.AWS_S3_KEY,
		clientSecret: process.env.AWS_S3_SECRET
	},
	cmsConfig: {
		databaseUrl: process.env.CMS_BUS_DATABASE_URL ? process.env.CMS_BUS_DATABASE_URL : (() => {
			const url = new URL(process.env.DATABASE_URL)
			return `${url.protocol}//${url.username}:${url.password}@${url.host}${url.pathname}`
		})(),
		schema: process.env.CMS_BUS_SCHEMA
	}
});

discordClient.login(process.env.DISCORD_TOKEN);

const apiPort = getPort();

await new Promise<void>(resolve => {
	server.listen(apiPort, () => resolve())
})

console.log(
`\n\n  \x1b[32m\x1b[1mAPI ready\x1b[0m

\x1b[32m➜\x1b[0m\x1b[1m  Local:     \x1b[0m\x1b[36mhttp://localhost:${apiPort}/
\x1b[32m➜\x1b[0m\x1b[1m  Network:   \x1b[0m\x1b[36m${getOrigin("http")}/
\x1b[32m➜\x1b[0m\x1b[2m  Env:       \x1b[0m\x1b[36m\x1b[2m${process.env.NODE_ENV}\x1b[0m`
);