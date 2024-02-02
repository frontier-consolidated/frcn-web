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