export function isAllowedRedirect(redirectUrl: URL, currentUrl: URL) {
	if (redirectUrl.hostname === "localhost") return true;
	if (redirectUrl.hostname === currentUrl.hostname) return true;

	const baseHost = currentUrl.hostname.split(".").slice(-2).join(".");
	if (redirectUrl.hostname.endsWith(baseHost)) return true;
	return false;
}
