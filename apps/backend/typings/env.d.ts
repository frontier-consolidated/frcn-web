export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Dict<string> {
			TZ?: string;

			DATABASE_URL: string;

			PORT: string;
			DOMAIN: string;
			SUB_DOMAIN?: string;

			ORIGINS: string;

			COOKIE_SECRET: string;
			SESSION_COOKIE: string;
			SESSION_SECRET: string;
			DISCORD_CLIENTID: string;
			DISCORD_SECRET: string;
			DISCORD_TOKEN: string;
		}
	}
}
