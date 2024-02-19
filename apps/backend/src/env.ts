import assert from "assert";

export function getPort() {
	return Number(process.env.PORT);
}

function hasExternalPort() {
	return process.env.EXTERNAL_PORT && !isNaN(Number(process.env.EXTERNAL_PORT))
}

export function getExternalPort() {
	if (hasExternalPort()) {
		return Number(process.env.EXTERNAL_PORT)
	}
	return getPort()
}

export function getDomain() {
	return process.env.DOMAIN;
}

export function getHost() {
	const domain = getDomain()
	const subDomain = process.env.SUB_DOMAIN;
	return `${subDomain}${subDomain ? "." : ""}${domain}${domain === "localhost" || hasExternalPort() ? `:${getExternalPort()}` : ""}`
}

export function getOrigin(protocol: string = "") {
	return `${protocol}://${getHost()}`;
}

export function getWebOrigin() {
	return process.env.WEB_ORIGIN
}

export function getOrigins() {
	const origins = (process.env.ORIGINS ?? "").split(",");

	for (const protocol in ["http", "https"]) {
		if (!origins.includes(getOrigin(protocol))) {
			origins.push(getOrigin(protocol));
		}
	}

	if (!origins.includes(getWebOrigin())) {
		origins.push(getWebOrigin())
	}

	return origins
}

export function isProd() {
	return process.env.NODE_ENV === "production"
}

export function validateEnvironment() {
	console.log("Validating environment...")

	// PORT=
	assert(!isNaN(getPort()), "Environment: Expected 'PORT' to be a number")

	// EXTERNAL_PORT=
	assert(!isNaN(getExternalPort()), "Environment: Expected 'EXTERNAL_PORT' to be a number")

	// DOMAIN=
	assert(process.env.DOMAIN && process.env.DOMAIN.length > 0, "Environment: Expected 'DOMAIN'")
	
	// SUB_DOMAIN=
	// xxx

	// WEB_ORIGIN=
	assert(process.env.WEB_ORIGIN && process.env.WEB_ORIGIN.length > 0, "Environment: Expected 'WEB_ORIGIN'")

	// ORIGINS=
	assert(process.env.ORIGINS && process.env.ORIGINS.length > 0, "Environment: Expected 'ORIGINS'")

	// DATABASE_URL=
	assert(process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0, "Environment: Expected 'DATABASE_URL'")

	// CONSENT_COOKIE=
	assert(process.env.CONSENT_COOKIE && process.env.CONSENT_COOKIE.length > 0, "Environment: Expected 'CONSENT_COOKIE'")

	// SESSION_COOKIE=
	assert(process.env.SESSION_COOKIE && process.env.SESSION_COOKIE.length > 0, "Environment: Expected 'SESSION_COOKIE'")

	// SESSION_SECRET=
	assert(process.env.SESSION_SECRET && process.env.SESSION_SECRET.length > 0, "Environment: Expected 'SESSION_SECRET'")

	// DEVICE_TRACK_COOKIE=
	assert(process.env.DEVICE_TRACK_COOKIE && process.env.DEVICE_TRACK_COOKIE.length > 0, "Environment: Expected 'DEVICE_TRACK_COOKIE'")

	// ADMIN_DISCORD_ID=
	if (isProd()) {
		assert(process.env.ADMIN_DISCORD_ID && process.env.ADMIN_DISCORD_ID.length > 0, "Environment: Expected 'ADMIN_DISCORD_ID' in production")
	}

	// DISCORD_CLIENTID=
	assert(process.env.DISCORD_CLIENTID && process.env.DISCORD_CLIENTID.length > 0, "Environment: Expected 'DISCORD_CLIENTID'")

	// DISCORD_SECRET=
	assert(process.env.DISCORD_SECRET && process.env.DISCORD_SECRET.length > 0, "Environment: Expected 'DISCORD_SECRET'")

	// DISCORD_TOKEN=
	assert(process.env.DISCORD_TOKEN && process.env.DISCORD_TOKEN.length > 0, "Environment: Expected 'DISCORD_TOKEN'")

	// AWS_S3_BUCKET=
	assert(process.env.AWS_S3_BUCKET && process.env.AWS_S3_BUCKET.length > 0, "Environment: Expected 'AWS_S3_BUCKET'")

	// AWS_S3_REGION=
	assert(process.env.AWS_S3_REGION && process.env.AWS_S3_REGION.length > 0, "Environment: Expected 'AWS_S3_REGION'")

	// AWS_S3_KEY=
	assert(process.env.AWS_S3_KEY && process.env.AWS_S3_KEY.length > 0, "Environment: Expected 'AWS_S3_KEY'")

	// AWS_S3_SECRET=
	assert(process.env.AWS_S3_SECRET && process.env.AWS_S3_SECRET.length > 0, "Environment: Expected 'AWS_S3_SECRET'")

	console.log("No issues with environment found")
}