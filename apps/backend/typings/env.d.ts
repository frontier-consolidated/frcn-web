export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Dict<string> {
			TZ?: string;

			PORT: string;
			DOMAIN: string;
			SUB_DOMAIN?: string;

			ORIGINS: string;

			DATABASE_URL: string;

			SESSION_COOKIE: string;
			SESSION_SECRET: string;

			DEVICE_TRACK_COOKIE: string;

			DISCORD_CLIENTID: string;
			DISCORD_SECRET: string;
			DISCORD_TOKEN: string;
		}
	}
}