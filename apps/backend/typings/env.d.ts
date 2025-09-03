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
			BASE_PATH?: string;

			WEB_ORIGIN: string;
			ORIGINS: string;

			DATABASE_URL: string;

			LOCAL_ACCESS_TOKEN?: string;

			ACCESS_KEY_HEADER: string;
			CONSENT_COOKIE: string;
			DEVICE_TRACK_COOKIE: string;

			SESSION_COOKIE: string;
			SESSION_SECRET: string;

			ADMIN_DISCORD_IDS?: string;

			DISCORD_CLIENTID: string;
			DISCORD_SECRET: string;
			DISCORD_TOKEN: string;

			AWS_S3_BUCKET: string;
			AWS_S3_REGION: string;
			AWS_S3_KEY: string;
			AWS_S3_SECRET: string;

			INTEGRATION_LEGION_CODA_TOKEN: string;
			INTEGRATION_LEGION_CODA_DOC_ID: string;
			INTEGRATION_LEGION_CODA_TABLE_ID: string;
		}
	}
}
