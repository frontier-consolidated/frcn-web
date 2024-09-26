import assert from "assert";

import { logger } from "./logger";

export function getPort() {
	return Number(process.env.PORT);
}

function hasExternalPort() {
	return process.env.EXTERNAL_PORT && !isNaN(Number(process.env.EXTERNAL_PORT));
}

export function getExternalPort() {
	if (hasExternalPort()) {
		return Number(process.env.EXTERNAL_PORT);
	}
	return getPort();
}

export function getDomain(withSubDomain = false) {
	const domain = process.env.DOMAIN;
	if (!withSubDomain) return domain;

	const subDomain = process.env.SUB_DOMAIN;
	return `${subDomain}${subDomain ? "." : ""}${domain}`;
}

export function getHost() {
	const domain = getDomain(true);
	return `${domain}${domain === "localhost" || hasExternalPort() ? `:${getExternalPort()}` : ""}`;
}

export function getBasePath() {
	let basePath = process.env.BASE_PATH;
	if (basePath && !basePath.startsWith("/")) {
		basePath = "/" + basePath;
	}
	return basePath ?? "";
}

export function getOrigin(protocol: string = "") {
	return `${protocol}://${getHost()}${getBasePath()}`;
}

export function getWebOrigin() {
	return process.env.WEB_ORIGIN;
}

export function getOrigins() {
	const origins = (process.env.ORIGINS ?? "").split(",");

	for (const protocol in ["http", "https"]) {
		if (!origins.includes(getOrigin(protocol))) {
			origins.push(getOrigin(protocol));
		}
	}

	if (!origins.includes(getWebOrigin())) {
		origins.push(getWebOrigin());
	}

	return origins;
}

export function getURL(protocol: string = "", path: string) {
	return new URL(getBasePath() + path, `${protocol}://${getHost()}`);
}

export function getWebURL(path: string) {
	return new URL(path, getWebOrigin());
}

export function isProd() {
	if (!process.env.NODE_ENV) return false;
	return process.env.NODE_ENV.trim() === "production";
}

export function getAdminIds() {
	const envIds = process.env.ADMIN_DISCORD_IDS ?? "";
	if (!envIds) return [];
	return envIds.split(",").map(id => id.trim());
}

function expectEnvvar(envvar: keyof NodeJS.ProcessEnv) {
	assert(process.env[envvar] && (process.env[envvar]?.length ?? 0) > 0, `Environment: Expected var '${envvar}'`);
}

export function validateEnvironment() {
	logger.info("Validating environment...");

	assert(!isNaN(getPort()), "Environment: Expected 'PORT' to be a number"); // PORT
	assert(!isNaN(getExternalPort()), "Environment: Expected 'EXTERNAL_PORT' to be a number"); // EXTERNAL_PORT
	expectEnvvar("DOMAIN");
	// SUB_DOMAIN
	// BASE_PATH

	expectEnvvar("WEB_ORIGIN");
	expectEnvvar("ORIGINS");

	expectEnvvar("DATABASE_URL");

	// CMS_BUS_DATABASE_URL
	expectEnvvar("CMS_BUS_SCHEMA");
	// if (process.env.SERVE_WEB === "true") expectEnvvar("CMS_ACCESS_KEY");

	expectEnvvar("LOCAL_ACCESS_TOKEN");

	expectEnvvar("ACCESS_KEY_HEADER");
	expectEnvvar("CONSENT_COOKIE");
	expectEnvvar("DEVICE_TRACK_COOKIE");

	expectEnvvar("SESSION_COOKIE");
	expectEnvvar("SESSION_SECRET");

	if (isProd()) expectEnvvar("ADMIN_DISCORD_IDS");

	expectEnvvar("DISCORD_CLIENTID");
	expectEnvvar("DISCORD_SECRET");
	expectEnvvar("DISCORD_TOKEN");

	expectEnvvar("AWS_S3_BUCKET");
	expectEnvvar("AWS_S3_REGION");
	expectEnvvar("AWS_S3_KEY");
	expectEnvvar("AWS_S3_SECRET");

	expectEnvvar("INTEGRATION_LEGION_CODA_TOKEN");
	expectEnvvar("INTEGRATION_LEGION_CODA_DOC_ID");
	expectEnvvar("INTEGRATION_LEGION_CODA_TABLE_ID");

	logger.info("No issues with environment found");
}