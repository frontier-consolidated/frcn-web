export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			TZ?: string;
			NODE_ENV?: string;

			PORT: string;
			EXTERNAL_PORT?: string;
			DOMAIN: string;
			SUB_DOMAIN?: string;

			WEB_ORIGIN: string;
			ORIGINS: string;

			DATABASE_URL: string;

			CONSENT_COOKIE: string;

			SESSION_COOKIE: string;
			SESSION_SECRET: string;

			DEVICE_TRACK_COOKIE: string;

			ADMIN_DISCORD_ID?: string;

			DISCORD_CLIENTID: string;
			DISCORD_SECRET: string;
			DISCORD_TOKEN: string;

			AWS_S3_BUCKET: string;
			AWS_S3_REGION: string;
			AWS_S3_KEY: string;
			AWS_S3_SECRET: string;
		}
	}
}
