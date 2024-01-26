export function getPort() {
	return Number(process.env.PORT);
}

export function getDomain() {
	return process.env.DOMAIN;
}

export function getHost() {
	const domain = getDomain()
	const subDomain = process.env.SUB_DOMAIN;
	return `${subDomain}${subDomain ? "." : ""}${domain}${domain === "localhost" ? `:${getPort()}` : ""}`
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