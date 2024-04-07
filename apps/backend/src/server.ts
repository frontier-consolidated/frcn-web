import pidusage from "pidusage";

import { createApp } from "./app";
import { seedDatabase } from "./database";
import { getDomain, getOrigin, getOrigins, getPort, validateEnvironment } from "./env";
import { logger } from "./logger";
import { $events } from "./services/events";

process.env.NODE_ENV ??= "development";
validateEnvironment();

await seedDatabase();

process.env.CMS_BUS_DATABASE_URL = process.env.CMS_BUS_DATABASE_URL ? process.env.CMS_BUS_DATABASE_URL : (() => {
	const url = new URL(process.env.DATABASE_URL);
	return `${url.protocol}//${url.username}:${url.password}@${url.host}${url.pathname}`;
})();

const { context: { server, discordClient }, onStart } = await createApp({
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
		domain: getDomain(true),
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
	accesskeyConfig: {
		header: process.env.ACCESS_KEY_HEADER,
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
		databaseUrl: process.env.CMS_BUS_DATABASE_URL!,
		schema: process.env.CMS_BUS_SCHEMA
	}
});

discordClient.login(process.env.DISCORD_TOKEN);

const apiPort = getPort();

await new Promise<void>(resolve => {
	server.listen(apiPort, () => resolve());
});

console.log(
`\n\n  \x1b[32m\x1b[1mAPI ready\x1b[0m

\x1b[32m➜\x1b[0m\x1b[1m  Local:     \x1b[0m\x1b[36mhttp://localhost:${apiPort}/
\x1b[32m➜\x1b[0m\x1b[1m  Network:   \x1b[0m\x1b[36m${getOrigin("http")}/
\x1b[32m➜\x1b[0m\x1b[2m  Env:       \x1b[0m\x1b[36m\x1b[2m${process.env.NODE_ENV}\x1b[0m`
);

await onStart();

setInterval(() => $events.$update().catch(console.error), 120 * 1000);

const usageThresholds = {
	cpu: {
		warning: 35,
		severe: 50
	},
	memory: {
		warning: 250_000_000,
		severe: 300_000_000
	},
};

function memFormat(memory: number) {
	return `${Math.round((memory / 1024 / 1024) * 10) / 10}MB`;
}

setTimeout(() => {
	// Wait a few seconds as startup uses more initial memory
	setInterval(() => {
		pidusage(process.pid, (err, stats) => {
			if (err) {
				logger.error("Error getting process metrics", err);
				return;
			}
	
			if (stats.cpu > usageThresholds.cpu.severe) {
				logger.error(logger.style("Cpu exceeded severe threshold!", { fg: "red" }), { threshold: usageThresholds.cpu.severe, usage: stats.cpu });
			} else if (stats.cpu > usageThresholds.cpu.warning) {
				logger.warn(logger.style("Cpu exceeded warning threshold!", { fg: "yellow" }), { threshold: usageThresholds.cpu.warning, usage: stats.cpu });
			}
	
			if (stats.memory > usageThresholds.memory.severe) {
				logger.error(logger.style(`Memory usage exceeded severe threshold! Usage: ${memFormat(stats.memory)}`, { fg: "red" }), { threshold: usageThresholds.memory.severe, usage: stats.memory });
			} else if (stats.memory > usageThresholds.memory.warning) {
				logger.warn(logger.style(`Memory usage exceeded warning threshold! Usage: ${memFormat(stats.memory)}`, { fg: "yellow" }), { threshold: usageThresholds.memory.warning, usage: stats.memory });
			}
		});
	}, 2000);
}, 5000);