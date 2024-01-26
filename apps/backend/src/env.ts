export function getHostname(protocol: string = "") {
	const subDomain = process.env.SUB_DOMAIN;
	return `${protocol}://${subDomain}${subDomain ? "." : ""}${process.env.DOMAIN}${
		process.env.DOMAIN == "localhost" ? `:${process.env.PORT}` : ""
	}`;
}
